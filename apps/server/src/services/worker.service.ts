import dotenv from 'dotenv';

import { workerRepository } from '../repositories/worker.repository';
import { WorkerListType } from '../types/worker.types';

dotenv.config();
export class WorkerService {
    public static async getWorkerList(exclusiveStartKey: string, nickname: string = null): Promise<WorkerListType> {
        const workerListResponse = await workerRepository.searchWorkers(exclusiveStartKey, nickname);

        return workerListResponse;
    }

    // public static async searchWorkerList(
    //     exclusiveStartKey: string,
    //     nickname: string
    // ): Promise<WorkerListType> {
    //     const response = await workerRepository.searchWorkers(exclusiveStartKey, nickname)
    //     const workerTypes: WorkerType[] = [];
    //
    //     const workers = response.workers;
    //     const lastEvaluatedKey = response.lastEvaluatedKey;
    //
    //     for(let worker of workers) {
    //         let workerType: WorkerType = {
    //             userID: worker.userID,
    //             nickname: worker.nickname,
    //             profile_image: worker.profileImage,
    //             projectsInvolved: worker.projectsInvolved,
    //         };
    //         workerTypes.push(workerType);
    //     }
    //
    //     const workerListType: WorkerListType = {lastEvaluatedKey: lastEvaluatedKey, workers: workerTypes };
    //
    //     return workerListType;
    // }
}
