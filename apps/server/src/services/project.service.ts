import { projectRepository } from '../repositories/project.repository';
import { ProjectQueryParams, ProjectType } from '../types/project.types';

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
    static async assignWorkers(title: string, workers: Record<string, string>[]) {
        try {
            return await projectRepository.assignWorkers(title, workers);
        } catch (error) {
            throw new Error('Failed to assign workers');
        }
    }
}
