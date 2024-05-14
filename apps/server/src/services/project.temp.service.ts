import { projectTempRepository } from '../repositories/project.temp.repository';

export class ProjectTempService {
    public static async deleteProject(title: string): Promise<any> {
        try {
            await projectTempRepository.deleteProject(title);
        } catch (error) {
            console.error('Error in service while delete project', error);
            throw error;
        }
    }
}
