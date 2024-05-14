import { GetCommand, PutCommand, ScanCommand, UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { ProjectListType, ProjectQueryParams, ProjectType, workerType } from '../types/project.types';

export class ProjectRepository {
    private ddbClient;
    private tableName = 'LemonSandbox';

    constructor(ddbClient) {
        this.ddbClient = ddbClient;
    }

    public async createProject(projectType: ProjectType): Promise<any> {
        const newProject = {
            ...projectType,
            skey: 'PROJECT',
        };

        await this.ddbClient.send(
            new PutCommand({
                TableName: this.tableName,
                Item: newProject,
            })
        );

        await this.addUserProjectsInvolved(projectType.workers, projectType.pkey);

        return newProject;
    }

    public async getProjects(
        projectQueryParams: ProjectQueryParams
    ): Promise<{ projectList: ProjectListType[]; lastEvaluatedKey: any }> {
        const { status, category, keyword, lastEvaluatedKey } = projectQueryParams;
        const queryParams = this.buildQueryParams(200, lastEvaluatedKey);

        // skey가 'PROJECT'인 항목만 필터링
        this.addFilter(queryParams, 'skey', 'PROJECT', '#skey = :skey');

        if (category) {
            this.addFilter(queryParams, 'category', category, '#category = :category');
        }

        if (keyword) {
            // 키워드가 pkey에 포함되어 있어야 하는 경우
            this.addFilter(queryParams, 'pkey', keyword, 'contains(#pkey, :pkey)');
        }

        if (!queryParams.FilterExpression) {
            delete queryParams.FilterExpression;
            delete queryParams.ExpressionAttributeNames;
            delete queryParams.ExpressionAttributeValues;
        }

        const command = new ScanCommand(queryParams);

        try {
            const { Items, LastEvaluatedKey } = await this.ddbClient.send(command);
            const formattedItems: ProjectListType[] = this.formatItems(Items);
            return { projectList: formattedItems, lastEvaluatedKey: LastEvaluatedKey };
        } catch (error) {
            console.error('Error getting projects:', error);
            throw error;
        }
    }

    private buildQueryParams(size: number, lastEvaluatedKey?: any): any {
        const queryParams = {
            TableName: this.tableName,
            Limit: size,
            ExclusiveStartKey: lastEvaluatedKey,
            FilterExpression: '',
            ExpressionAttributeNames: {},
            ExpressionAttributeValues: {},
        };

        return queryParams;
    }

    private addFilter(queryParams: any, attribute: string, value?: string, expression?: string) {
        if (value != null) {
            console.log('value:', value);
            if (queryParams.FilterExpression.length > 0) {
                console.log('AND');
                queryParams.FilterExpression += ' AND ';
            }
            queryParams.ExpressionAttributeNames[`#${attribute}`] = attribute;
            queryParams.ExpressionAttributeValues[`:${attribute}`] = value;
            queryParams.FilterExpression += expression;
        }
    }

    private formatItems(items: any[]): ProjectListType[] {
        return items.map(item => ({
            imgURL: item.imgUrls ? item.imgUrls[0] : '',
            progress: item.progress,
            title: item.pkey,
            category: item.category,
        }));
    }

    public async assignWorkers(title: string, workers: workerType[]) {
        try {
            const updateCommand = new UpdateCommand({
                TableName: this.tableName,
                Key: {
                    pkey: title,
                    skey: 'PROJECT',
                },
                UpdateExpression: 'set workers = :workers',
                ExpressionAttributeValues: {
                    ':workers': workers,
                },
                ReturnValues: 'UPDATED_NEW',
            });

            const result = await this.ddbClient.send(updateCommand);
            console.log('Workers assigned successfully:', result);
            workers.forEach(worker => {
                this.updateWorkerProjects(worker.id, title);
            });
        } catch (error) {
            console.error('Error assigning workers:', error);
            throw error;
        }
    }

    public async updateWorkerProjects(workerId: string, projectId: string): Promise<void> {
        const params = new UpdateCommand({
            TableName: this.tableName,
            Key: {
                pkey: workerId,
                skey: 'USER',
            },
            UpdateExpression:
                'SET projectsInvolved = list_append(if_not_exists(projectsInvolved, :empty_list), :new_project)',
            ExpressionAttributeValues: {
                ':new_project': [projectId],
                ':empty_list': [],
            },
            ReturnValues: 'UPDATED_NEW',
        });

        try {
            const result = await this.ddbClient.send(params);
            console.log('Project added to worker successfully:', result);
        } catch (error) {
            console.error('Error updating worker projects:', error);
            throw error;
        }
    }

    public async approvalProject(title: string, imgURL: string, status: string) {
        try {
            const updateCommand = new UpdateCommand({
                TableName: this.tableName,
                Key: {
                    pkey: title,
                    skey: imgURL,
                },
                UpdateExpression: 'set #status = :status',
                ExpressionAttributeValues: {
                    ':status': status,
                },
                ExpressionAttributeNames: {
                    '#status': 'status',
                },
                ReturnValues: 'UPDATED_NEW',
            });

            const result = await this.ddbClient.send(updateCommand);
            console.log('Project approved successfully:', result);
        } catch (error) {
            console.error('Error approving project:', error);
            throw error;
        }
    }

    public async updateProgress(title: string): Promise<void> {
        try {
            // 1. pkey = title이고 skey = "PROJECT"인 항목의 progress 값과 imgUrls[] 값을 가져온다.
            const projectParams = {
                TableName: this.tableName,
                Key: {
                    pkey: title,
                    skey: 'PROJECT',
                },
            };

            const projectResult = await this.ddbClient.send(new GetCommand(projectParams));
            if (!projectResult.Item) {
                throw new Error(`Project with title ${title} not found`);
            }

            const { imgUrls, progress } = projectResult.Item;

            // 2. progress 값과 imgUrls[] length를 통해 completedCount를 계산한다.
            const completedCount = Math.round(progress * imgUrls.length);

            // 3. progress를 업데이트한다.
            const newProgress = (completedCount + 1) / imgUrls.length;
            const updateProgressParams = new UpdateCommand({
                TableName: this.tableName,
                Key: {
                    pkey: title,
                    skey: 'PROJECT',
                },
                UpdateExpression: 'set #progress = :progress',
                ExpressionAttributeValues: {
                    ':progress': newProgress,
                },
                ExpressionAttributeNames: {
                    '#progress': 'progress',
                },
                ReturnValues: 'UPDATED_NEW',
            });

            const updateResult = await this.ddbClient.send(updateProgressParams);
            console.log('Progress updated successfully:', updateResult);
        } catch (error) {
            console.error('Error updating project progress:', error);
            throw error;
        }
    }

    public async addUserProjectsInvolved(workers: workerType[], title: string) {
        for (const worker of workers) {
            const userID = worker.id;
            const params: UpdateCommandInput = {
                TableName: 'LemonSandbox',
                Key: { pkey: userID, skey: 'USER' },
                UpdateExpression:
                    'SET projectsInvolved =  list_append(if_not_exists(projectsInvolved, :empty_list), :new_project)',
                ExpressionAttributeValues: {
                    ':new_project': [title],
                    ':empty_list': [],
                },
            };

            const command = new UpdateCommand(params);

            // 커맨드 디비에 전송
            await ddbDocumentClient.send(command);
        }
    }
}

export const projectRepository = new ProjectRepository(ddbDocumentClient);
