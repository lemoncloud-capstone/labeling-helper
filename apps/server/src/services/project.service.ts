import { projectRepository } from '../repositories/project.repository';
import { ProjectQueryParams, ProjectType, status, workerType } from '../types/project.types';

export class ProjectService {
    public static async createProject(projectType: ProjectType): Promise<any> {
        try {
            return await projectRepository.createProject(projectType);
        } catch (error) {
            throw new Error('Failed to create project');
        }
    }

    public static async getProjects(projectQueryParams: ProjectQueryParams): Promise<any> {
        try {
            return await projectRepository.getProjects(projectQueryParams);
        } catch (error) {
            throw new Error('Failed to get projects');
        }
    }
    //work 리스트 받아서 저장
    static async assignWorkers(title: string, workers: workerType[]) {
        try {
            return await projectRepository.assignWorkers(title, workers);
        } catch (error) {
            throw new Error('Failed to assign workers');
        }
    }

    static async approvalProject(title: string, imgURL: string, status: status) {
        try {
            if (status == 'completed') {
                await projectRepository.updateProgress('P' + title);
            }
            return await projectRepository.approvalProject('I' + title, imgURL, status);
        } catch (error) {
            throw new Error('Failed to approval project');
        }
    }
}
