import { Request, Response } from 'express';
import { z } from 'zod';

import { ImageService } from '../services/image.service';
import { ProjectService } from '../services/project.service';
import { ProjectType, status, workerType } from '../types/project.types';
import { BaseResponseCode, BaseResponseMessages } from '../utils/errors';
import { sendResponse } from '../utils/response';

//Zod를 사용한 코드 검증
const WorkerSchema = z.object({
    id: z.string(),
    nickname: z.string(),
});

const ProjectInputSchema = z.object({
    imgUrls: z.array(z.string()),
    title: z.string(),
    category: z.string(),
    labels: z.array(z.string()),
    workers: z.array(WorkerSchema).optional().default([]),
});

const lastEvaluatedKeySchema = z.object({
    pkey: z.string(),
    skey: z.string(),
});

const getProjectsInputSchema = z.object({
    lastEvaluatedKey: lastEvaluatedKeySchema.optional(),
    status: z.string().optional(),
    category: z.string().optional(),
    keyword: z.string().optional(),
});

const approvalBodySchema = z.object({
    title: z.string(),
    imgURL: z.string(),
    status: z.string(),
});

const AssignWorkersSchema = z.object({
    workers: z.array(WorkerSchema),
    title: z.string(),
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
                imgUrls,
                pkey: title,
                category,
                labels,
                workers: workers as workerType[],
                progress: 0,
            };

            const result = await ProjectService.createProject(projectType);
            await ImageService.addImageList(imgUrls, title, labels);

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
            if (query.keyword) {
                query.keyword = 'P' + query.keyword;
            }
            const result = await ProjectService.getProjects(query);

            sendResponse(res, BaseResponseCode.SUCCESS, BaseResponseMessages[BaseResponseCode.SUCCESS], result);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_GET_PROJECTS, error.message);
        }
    }

    public static async assignWorkers(req: Request, res: Response): Promise<void> {
        const validationResult = AssignWorkersSchema.safeParse(req.body);
        if (!validationResult.success) {
            sendResponse(res, BaseResponseCode.ValidationError);
            return;
        }

        const { workers, title } = validationResult.data;

        try {
            const typedWorkers: workerType[] = workers as workerType[];
            await ProjectService.assignWorkers('P' + title, typedWorkers);
            sendResponse(res, BaseResponseCode.SUCCESS);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_ASSIGN_WORKERS, error.message);
        }
    }

    public static async approvalProject(req: Request, res: Response): Promise<void> {
        const validationBodyResult = approvalBodySchema.safeParse(req.body);
        if (!validationBodyResult.success) {
            sendResponse(res, BaseResponseCode.ValidationError);
            return;
        }

        const { title, imgURL, status } = validationBodyResult.data;
        const typedStatus: status = status as status;
        try {
            await ProjectService.approvalProject(title, imgURL, typedStatus);

            sendResponse(res, BaseResponseCode.SUCCESS);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_APPROVAL_PROJECT, error.message);
        }
    }
}
