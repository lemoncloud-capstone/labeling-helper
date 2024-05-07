import dotenv from 'dotenv';

import { imageRepository } from '../repositories/image.repository';
import { Status } from '../types/image.types';

dotenv.config();
export class ImageService {
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
}
