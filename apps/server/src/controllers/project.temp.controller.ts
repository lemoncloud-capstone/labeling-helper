import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { z } from 'zod';

import { ProjectTempService } from '../services/project.temp.service';
import { BaseResponseCode, BaseResponseMessages } from '../utils/errors';
import { sendResponse } from '../utils/response';

dotenv.config();

const DeleteProjectSchema = z.object({
    title: z.string(),
});

export class ProjectTempController {
    public static async deleteProject(req: Request, res: Response): Promise<void> {
        const bodyValidationResult = DeleteProjectSchema.safeParse(req.body);

        if (!bodyValidationResult.success) {
            sendResponse(res, BaseResponseCode.ValidationError, 'Validation failed');
            return;
        }

        const title = bodyValidationResult.data.title;

        try {
            await ProjectTempService.deleteProject(title);
            sendResponse(res, BaseResponseCode.SUCCESS, BaseResponseMessages[BaseResponseCode.SUCCESS]);
        } catch (error) {
            console.error(error);
            sendResponse(res, BaseResponseCode.BAD_REQUEST);
        }
    }
}
