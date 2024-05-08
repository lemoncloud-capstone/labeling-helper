import { Request, Response } from 'express';
import { z } from 'zod';

import { ProjectService } from '../services/project.service';
import { ProjectType } from '../types/project.types';
import { BaseResponseCode, BaseResponseMessages } from '../utils/errors';
import { sendResponse } from '../utils/response';

//Zod를 사용한 코드 검증
const ProjectInputSchema = z.object({
    imgUrls: z.array(z.string()),
    title: z.string(),
    category: z.string(),
    labels: z.array(z.string()),
    workers: z.array(z.string()),
});

const lastEvaluatedKeySchema = z.object({
    title: z.string(),
});

const getProjectsInputSchema = z.object({
    lastEvaluatedKey: lastEvaluatedKeySchema.optional(),
    status: z.string().optional(),
    category: z.string().optional(),
    keyword: z.string().optional(),
});

const GetImagesInputSchema = z.object({
    lastEvaluatedKey: z.string().optional(),
});

export class ProjectController {
    public static async createProject(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = ProjectInputSchema.safeParse(req.body);
            if (!validationResult.success) {
                sendResponse(res, BaseResponseCode.ValidationError);
                return;
            }

            const { imgUrls, title, category, labels, workers } = validationResult.data;

            const projectType: ProjectType = {
                imgUrls: imgUrls,
                title: title,
                category: category,
                labels: labels,
                workers: workers,
                progress: 0,
            };

            const result = await ProjectService.createProject(projectType);
            sendResponse(res, BaseResponseCode.SUCCESS);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_CREATE_PROJECT, error.message);
        }
    }

    public static async getProjects(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = getProjectsInputSchema.safeParse(req.body);
            if (!validationResult.success) {
                sendResponse(res, BaseResponseCode.ValidationError);
                return;
            }

            const query = Object.fromEntries(Object.entries(validationResult.data).filter(([_, v]) => v !== undefined));

            const result = await ProjectService.getProjects(query);

            sendResponse(res, BaseResponseCode.SUCCESS, BaseResponseMessages[BaseResponseCode.SUCCESS], {
                result,
            });
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_GET_PROJECTS, error.message);
        }
    }
}
