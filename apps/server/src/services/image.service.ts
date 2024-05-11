import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

import { imageRepository } from '../repositories/image.repository';
import { s3 } from '../s3/s3Config';
import { Status } from '../types/image.types';

dotenv.config();

export class ImageService {
    // db에 이미지 저장
    public static async addImageList(
        imageUrls: string[],
        title: string,
        status: Status = Status.Available,
        labels: string[] = null
    ): Promise<any> {
        try {
            for (const imageUrl of imageUrls) {
                await imageRepository.addImage(imageUrl, title, status, labels);
            }
            return;
        } catch (error) {
            console.error('Error in service while add images:', error);
            throw error;
        }
    }

    // s3에서 이미지 가져오기
    public static async getS3Images(pageSize: number, continuationToken: string): Promise<any> {
        if (continuationToken === 'null') {
            continuationToken = undefined;
        }

        try {
            const command = new ListObjectsV2Command({
                Bucket: process.env.BUCKET_NAME, // S3 버킷 이름
                MaxKeys: pageSize,
                ContinuationToken: continuationToken as string | undefined,
            });

            const { Contents, NextContinuationToken } = await s3.send(command);

            const img = Contents?.map(({ Key }) => ({
                url: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${Key}`,
            }));

            // 업로드된 이미지의 URL 반환
            return {
                nextContinuationToken: NextContinuationToken,
                img,
            };
        } catch (error) {
            console.error('Error in service while get s3 images:', error);
            throw error;
        }
    }
}
