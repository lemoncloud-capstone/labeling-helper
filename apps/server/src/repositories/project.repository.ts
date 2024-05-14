import { PutCommand, ScanCommand, UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

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
        const queryParams = this.buildQueryParams(20, lastEvaluatedKey);

        this.addFilter(queryParams, 'status', status, '#status = :status');
        this.addFilter(queryParams, 'category', category, '#category = :category');
        this.addFilter(queryParams, 'pkey', keyword, 'contains(#pkey, :pkey)');

        if (queryParams.FilterExpression === '') {
            delete queryParams.FilterExpression;
            delete queryParams.ExpressionAttributeNames;
            delete queryParams.ExpressionAttributeValues;
        }

        const command = queryParams.FilterExpression
            ? new ScanCommand(queryParams)
            : new ScanCommand({
                  TableName: queryParams.TableName,
                  Limit: queryParams.Limit,
                  ExclusiveStartKey: queryParams.ExclusiveStartKey,
              });

        const { Items, LastEvaluatedKey } = await this.ddbClient.send(command);
        const formattedItems: ProjectListType[] = this.formatItems(Items);
        return { projectList: formattedItems, lastEvaluatedKey: LastEvaluatedKey };
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
        if (value) {
            if (queryParams.FilterExpression.length > 0) {
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

    public async assignWorkers(title: string, workers: Record<string, string>[]) {
        await this.ddbClient.send(
            new PutCommand({
                TableName: this.tableName,
                Item: {
                    pkey: title,
                    skey: 'PROJECT',
                    workers: workers,
                },
            })
        );
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
