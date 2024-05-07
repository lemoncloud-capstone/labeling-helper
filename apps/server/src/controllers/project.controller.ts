import { Request, Response } from 'express';
import { z } from 'zod';

import { ProjectService } from '../services/project.service';
import { ProjectType } from '../types/project.types';
import { sendResponse } from '../utils/response';

// Zod를 사용한 코드 검증
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
                sendResponse(res, 2002);
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
            sendResponse(res, 1000);
        } catch (error) {
            console.error('Error in controller while creating projects:', error);
            sendResponse(res, 4000);
        }
    }

    public static async getProjects(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = getProjectsInputSchema.safeParse(req.body);
            if (!validationResult.success) {
                sendResponse(res, 2002);
                return;
            }

            const query = Object.fromEntries(Object.entries(validationResult.data).filter(([_, v]) => v !== undefined));

            const result = await ProjectService.getProjects(query);

            sendResponse(res, 1000, {
                result,
            });
        } catch (error) {
            console.error('Error in controller while getting projects:', error);
            sendResponse(res, 4001);
        }
    }
}
