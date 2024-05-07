import { projectRepository } from '../repositories/project.repository';
import { ProjectQueryParams, ProjectType } from '../types/project.types';

export class ProjectService {
    public static async createProject(projectType: ProjectType): Promise<any> {
        try {
            return await projectRepository.createProject(projectType);
        } catch (error) {
            console.error('Error in service while creating projects:', error);
            throw error;
        }
    }

    public static async getProjects(projectQueryParams: ProjectQueryParams): Promise<any> {
        try {
            return await projectRepository.getProjects(projectQueryParams);
        } catch (error) {
            console.error('Error in service while fetching projects:', error);
            throw error;
        }
    }
}
