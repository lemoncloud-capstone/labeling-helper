import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { ImageType, Status } from '../types/image.types';

export class ImageRepository {
    public async addImage(imageUrl: string, title: string, status: Status, labels: string[]): Promise<any> {
        const newImageType: ImageType = {
            pkey: 'I' + title,
            skey: imageUrl,
            status: status,
            latestTimestamp: new Date(Date.now()),
            labels: labels,
        };

        try {
            await ddbDocumentClient.send(
                new PutCommand({
                    TableName: 'LemonSandbox', // 이미지 테이블 이름
                    Item: newImageType,
                })
            );
            console.log('Image added to DynamoDB:', newImageType);
            return;
        } catch (error) {
            console.error('Error adding Image to DynamoDB:', error);
            throw error;
        }
    }
}

export const imageRepository = new ImageRepository();
