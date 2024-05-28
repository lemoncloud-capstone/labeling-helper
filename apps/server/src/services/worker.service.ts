import dotenv from 'dotenv';

import { workerRepository } from '../repositories/worker.repository';
import { WorkerListType } from '../types/worker.types';

dotenv.config();
export class WorkerService {
    public static async getWorkerList(exclusiveStartKey: string, nickname: string = null): Promise<WorkerListType> {
        try {
            const workerListResponse = await workerRepository.searchWorkers(exclusiveStartKey, nickname);
            return workerListResponse;
        } catch (error) {
            console.error('Error in service while get workers:', error);
            throw error;
        }
    }

    static async getAssignedWorkers(projectId: string) {
        try {
            const assignedWorkers = await workerRepository.getAssignedWorkers(projectId);
            return assignedWorkers;
        } catch (error) {
            console.error('Error in service while get assigned workers:', error);
            throw error;
        }
    }
}
