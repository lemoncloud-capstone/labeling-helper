import { imgRepository } from '../repositories/img.repository';

export class ImgService {
    public static async getProjectImages(title: string, lastEvaluatedKey?: any): Promise<any> {
        try {
            return await imgRepository.getProjectImages(title, lastEvaluatedKey);
        } catch (error) {
            console.error('Error in service while fetching project images:', error);
            throw error;
        }
    }

    static async updateStatus(title: string, imgURL: string, status: any) {
        try {
            return await imgRepository.updateImageStatus(title, imgURL, status);
        } catch (error) {
            console.error('Error in service while updating project status:', error);
            throw error;
        }
    }
}
