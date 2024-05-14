import { QueryCommand, QueryCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';

import { ddbDocumentClient } from './index';

export class ImgRepository {
    private ddbClient;
    private tableName = 'LemonSandbox';

    constructor(ddbClient) {
        this.ddbClient = ddbClient;
    }

    public async getProjectImages(title: string, lastEvaluatedKey?: string): Promise<any> {
        const queryParams: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: 'pkey = :pkey',
            ExpressionAttributeValues: {
                ':pkey': title,
            },
            Limit: 50,
            ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined,
        };

        const { Items, LastEvaluatedKey } = await this.ddbClient.send(new QueryCommand(queryParams));
        try {
            // 비동기로 모든 이미지 URL을 Blob 형태로 가져오기
            const imgPromises = Items.map(async (item: any) => {
                try {
                    const response = await axios.get(item.skey, { responseType: 'arraybuffer' });
                    const blob = Buffer.from(response.data, 'binary').toString('base64');
                    return {
                        imgURL: item.skey,
                        status: item.status,
                        labelPoint: item.labelPoints,
                        blob: blob,
                    };
                } catch (error) {
                    console.error(`Error fetching image from ${item.skey}:`, error.message);
                    return {
                        imgURL: item.skey,
                        status: item.status,
                        labelPoint: item.labelPoints,
                        blob: null,
                    };
                }
            });

            // 모든 이미지를 Blob 형태로 변환할 때까지 기다리기
            const img = await Promise.all(imgPromises);

            return {
                lastEvaluatedKey: LastEvaluatedKey ? JSON.stringify(LastEvaluatedKey) : null,
                img: img,
            };
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    }

    public async updateImageStatus(title: string, imageURL: string, status: string, labelPoints): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                pkey: title,
                skey: imageURL,
            },
            UpdateExpression: 'SET #status = :status, #labelPoints = :labelPoints',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#labelPoints': 'labelPoints',
            },
            ExpressionAttributeValues: {
                ':status': status,
                ':labelPoints': this.formatLabelPoints(labelPoints),
            },
        };

        await this.ddbClient.send(new UpdateCommand(params));
    }

    private formatLabelPoints(labelPoints) {
        const formatted = {};
        for (const key in labelPoints) {
            formatted[key] = labelPoints[key].map(point => ({
                leftTop: { x: String(point.leftTop.x), y: String(point.leftTop.y) },
                rightTop: { x: String(point.rightTop.x), y: String(point.rightTop.y) },
                leftBottom: { x: String(point.leftBottom.x), y: String(point.leftBottom.y) },
                rightBottom: { x: String(point.rightBottom.x), y: String(point.rightBottom.y) },
            }));
        }
        return formatted;
    }
}
export const imgRepository = new ImgRepository(ddbDocumentClient);
