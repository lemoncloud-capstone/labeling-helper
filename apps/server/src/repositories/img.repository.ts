import { QueryCommand, QueryCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';

export class ImgRepository {
    private ddbClient;
    private tableName = 'ProjectImages';

    constructor(ddbClient) {
        this.ddbClient = ddbClient;
    }

    public async getProjectImages(title: string, lastEvaluatedKey?: string): Promise<any> {
        const queryParams: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: 'title = :title',
            ExpressionAttributeValues: {
                ':title': title,
            },
            Limit: 10,
            ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined,
        };

        try {
            const { Items, LastEvaluatedKey } = await this.ddbClient.send(new QueryCommand(queryParams));
            return {
                lastEvaluatedKey: LastEvaluatedKey ? JSON.stringify(LastEvaluatedKey) : null,
                workers: Items.map((item: any) => item.workers).flat(),
                labels: Items.map((item: any) => item.labels).flat(),
                img: Items.map((item: any) => ({
                    imgURL: item.imageURL,
                    status: item.status,
                    labels: item.labels,
                })),
            };
        } catch (error) {
            console.error('Error in repository while fetching project images :', error);
            throw error;
        }
    }

    public async updateImageStatus(title: string, imageURL: string, status: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                title: { S: title },
                imageURL: { S: imageURL },
            },
            UpdateExpression: 'SET #status = :status',
            ExpressionAttributeNames: {
                '#status': 'status',
            },
            ExpressionAttributeValues: {
                ':status': { S: status },
            },
        };

        try {
            await this.ddbClient.send(new UpdateCommand(params));
            console.log('Status updated successfully.');
        } catch (error) {
            console.error('Error in repository while updating status:', error);
            throw error;
        }
    }
}
export const imgRepository = new ImgRepository(ddbDocumentClient);
