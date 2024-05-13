import { PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { ProjectListType, ProjectQueryParams, ProjectType } from '../types/project.types';

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
        return newProject;
    }

    public async getProjects(
        projectQueryParams: ProjectQueryParams
    ): Promise<{ projectList: ProjectListType[]; lastEvaluatedKey: any }> {
        const { status, category, keyword, lastEvaluatedKey } = projectQueryParams;
        const queryParams = this.buildQueryParams(20, lastEvaluatedKey);

        this.addFilter(queryParams, 'skey', 'PROJECT', '#skey = :skey');

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
        } catch (error) {
            console.error('Error assigning workers:', error);
            throw error;
        }
    }
}

export const projectRepository = new ProjectRepository(ddbDocumentClient);
