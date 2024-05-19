import { imgRepository } from '../repositories/img.repository';

export class ImgService {
    public static async getProjectImages(title: string, lastEvaluatedKey?: any): Promise<any> {
        try {
            return await imgRepository.getProjectImages(title, lastEvaluatedKey);
        } catch (error) {
            throw new Error('Failed to get project images');
        }
    }

    static async updateStatus(title: string, imgURL: string, status: any, labelPoint: any) {
        try {
            const formattedLabelPoints = this.formatLabelPoints(labelPoint);
            return await imgRepository.updateImageStatus(title, imgURL, status, formattedLabelPoints);
        } catch (error) {
            throw new Error(error);
        }
    }
    private static formatLabelPoints(labelPoints: any[]): any {
        const formatted = {};
        for (const point of labelPoints) {
            const label = point.label;
            if (!formatted[label]) {
                formatted[label] = [];
            }
            formatted[label].push({
                leftTop: { x: String(point.leftTop[0]), y: String(point.leftTop[1]) },
                rightTop: { x: String(point.rightTop[0]), y: String(point.rightTop[1]) },
                leftBottom: { x: String(point.leftBottom[0]), y: String(point.leftBottom[1]) },
                rightBottom: { x: String(point.rightBottom[0]), y: String(point.rightBottom[1]) },
            });
        }
        return formatted;
    }
}
