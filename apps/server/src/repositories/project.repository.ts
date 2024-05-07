import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { ProjectListType, ProjectQueryParams, ProjectType } from '../types/project.types';

export class ProjectRepository {
    private ddbClient;
    private tableName = 'Projects';

    constructor(ddbClient) {
        this.ddbClient = ddbClient;
    }

    public async createProject(projectType: ProjectType): Promise<any> {
        const newProject = {
            ...projectType,
        };

        try {
            await this.ddbClient.send(
                new PutCommand({
                    TableName: this.tableName,
                    Item: newProject,
                })
            );
            console.log('Project added to DB:', newProject);
            return newProject;
        } catch (error) {
            console.error('Error in repository while creating projects:', error);
            throw error;
        }
    }

    public async getProjects(
        projectQueryParams: ProjectQueryParams
    ): Promise<{ projectList: ProjectListType[]; lastEvaluatedKey: any }> {
        const { status, category, keyword, lastEvaluatedKey } = projectQueryParams;
        const queryParams = this.buildQueryParams(20, lastEvaluatedKey);
        console.log('queryParams:', projectQueryParams);

        this.addFilter(queryParams, 'status', status, '#status = :status');
        this.addFilter(queryParams, 'category', category, '#category = :category');
        this.addFilter(queryParams, 'title', keyword, 'contains(#title, :title)');

        if (queryParams.FilterExpression === '') {
            delete queryParams.FilterExpression;
            delete queryParams.ExpressionAttributeNames;
            delete queryParams.ExpressionAttributeValues;
        }

        try {
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
        } catch (error) {
            console.error('Error in repository while fetching projects:', error);
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
        console.log('addFilter:', attribute, value, expression);
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
            title: item.title,
            category: item.category,
        }));
    }
}

export const projectRepository = new ProjectRepository(ddbDocumentClient);
