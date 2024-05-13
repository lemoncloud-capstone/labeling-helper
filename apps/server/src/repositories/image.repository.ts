import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { ImageType } from '../types/image.types';

export class ImageRepository {
    public async addImage(image: ImageType): Promise<void> {
        try {
            await ddbDocumentClient.send(
                new PutCommand({
                    TableName: 'LemonSandbox',
                    Item: image,
                })
            );
            console.log('Image added to DynamoDB:', image);
            return;
        } catch (error) {
            console.error('Error adding image to DynamoDB:', error);
            throw error;
        }
    }
}

export const imageRepository = new ImageRepository();
