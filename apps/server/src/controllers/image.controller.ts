import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { z } from 'zod';

import { ImageService } from '../services/image.service';
import { BaseResponseCode, BaseResponseMessages } from '../utils/errors';
import { sendResponse } from '../utils/response';

dotenv.config();

const getS3ImagesSchema = z.object({
    size: z.string().nullish(),
    continuationToken: z.string().nullish(),
});

export class ImageController {
    public static async getS3Images(req: Request, res: Response): Promise<void> {
        const queryValidationResult = getS3ImagesSchema.safeParse(req.query);

        if (!queryValidationResult.success) {
            sendResponse(res, BaseResponseCode.ValidationError, 'Validation failed');
            return;
        }

        const { size, continuationToken } = queryValidationResult.data;

        const pageSize = size ? parseInt(size as string, 10) : 20;

        try {
            const result = await ImageService.getS3Images(pageSize, continuationToken);
            sendResponse(res, BaseResponseCode.SUCCESS, BaseResponseMessages[BaseResponseCode.SUCCESS], result);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_GET_S3_IMAGES, error.message);
        }
    }
}
