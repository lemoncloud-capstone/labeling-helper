import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { z } from 'zod';

import { WorkerService } from '../services/worker.service';
import { sendResponse } from '../utils/response';

dotenv.config();

// Zod를 사용한 코드 검증
const WorkerListBodySchema = z.object({
    lastEvaluatedKey: z.string().nullable(),
});

const WorkerListQuerySchema = z.object({
    nickname: z.string().nullish(),
});

export class WorkerController {
    public static async workerList(req: Request, res: Response): Promise<void> {
        const bodyValidationResult = WorkerListBodySchema.safeParse(req.body);
        const queryValidationResult = WorkerListQuerySchema.safeParse(req.query);

        if (!bodyValidationResult.success || !queryValidationResult.success) {
            sendResponse(res, 400, 'Validation failed');
            return;
        }

        const exclusiveStartKey = bodyValidationResult.data.lastEvaluatedKey;
        const nickname = queryValidationResult.data.nickname;

        try {
            // 유저 목록
            // 유저에 따른 프로젝트 목록
            const workerList = await WorkerService.getWorkerList(exclusiveStartKey, nickname);
            sendResponse(res, 200, 'Worker list successfully inquiry', workerList);
        } catch (error) {
            console.error(error);
            sendResponse(res, 500, 'Internal Server Error');
        }
    }
}
