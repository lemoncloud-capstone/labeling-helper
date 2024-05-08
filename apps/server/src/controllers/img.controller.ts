import { Request, Response } from 'express';
import { z } from 'zod';

import { ImgService } from '../services/img.service';
import { BaseResponseCode } from '../utils/errors';
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
            sendResponse(res, BaseResponseCode.SUCCESS, result);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_GET_IMAGES, error.message);
        }
    }

    public static async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const { title, imgURL } = req.params;
            const { status } = req.body;

            await ImgService.updateStatus(title, imgURL, status);
            sendResponse(res, BaseResponseCode.SUCCESS);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_UPDATE_STATUS, error.message);
        }
    }
}
