import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

import { imageRepository } from '../repositories/image.repository';
import { s3 } from '../s3/s3Config';
import { ImageType, LabelPoints, Status } from '../types/image.types';

dotenv.config();

export class ImageService {
    // db에 이미지 저장
    // Service.ts
    public static async addImageList(imageUrls: string[], title: string, labels: string[] = []): Promise<any> {
        try {
            const labelsData = this.initializeLabelData(labels);
            const modifiedTitle = 'I' + title.slice(0);

            for (const imageUrl of imageUrls) {
                const newImageType: ImageType = {
                    pkey: modifiedTitle,
                    skey: imageUrl,
                    status: Status.Available,
                    latestTimestamp: Date.now(),
                    labelPoints: labelsData,
                };
                await imageRepository.addImage(newImageType);
            }
            return;
        } catch (error) {
            console.error('Error in service while adding images:', error);
            throw error;
        }
    }

    // 라벨데이터 초기화
    private static initializeLabelData(labels: string[]): LabelPoints {
        const labelStructure = {
            leftTop: { x: null, y: null },
            rightTop: { x: null, y: null },
            leftBottom: { x: null, y: null },
            rightBottom: { x: null, y: null },
        };

        const labelsData: LabelPoints = {};
        for (const label of labels) {
            labelsData[label] = [
                JSON.parse(JSON.stringify(labelStructure)),
                JSON.parse(JSON.stringify(labelStructure)),
            ];
        }
        return labelsData;
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
