import { imgRepository } from '../repositories/img.repository';

export class ImgService {
    public static async getProjectImages(title: string, lastEvaluatedKey?: any): Promise<any> {
        try {
            return await imgRepository.getProjectImages(title, lastEvaluatedKey);
        } catch (error) {
            throw new Error('Failed to get project images');
        }
    }

    static async updateStatus(title: string, imgURL: string, status: any) {
        try {
            return await imgRepository.updateImageStatus(title, imgURL, status);
        } catch (error) {
            throw new Error('Failed to update image status');
        }
    }
}
