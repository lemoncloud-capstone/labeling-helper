import { Request, Response } from 'express';
import { z } from 'zod';

import { ImgService } from '../services/img.service';
import { sendResponse } from '../utils/response';

// Zod를 사용한 코드 검증
const lastEvaluatedKeySchema = z.object({
    title: z.string(),
});
const GetImagesInputSchema = z.object({
    lastEvaluatedKey: lastEvaluatedKeySchema.optional(),
});

export class ImgController {
    public static async getProjectImages(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.params;
            const { lastEvaluatedKey } = GetImagesInputSchema.parse(req.body);

            const result = await ImgService.getProjectImages(title, lastEvaluatedKey);
            sendResponse(res, 1000, result);
        } catch (error) {
            console.error('Error in controller while fetching project images:', error);
            sendResponse(res, 4002);
        }
    }

    public static async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const { title, imgURL } = req.params;
            const { status } = req.body;

            await ImgService.updateStatus(title, imgURL, status);
            sendResponse(res, 1000);
        } catch (error) {
            console.error('Error in controller while updating project status:', error);
            sendResponse(res, 4003);
        }
    }
}
