import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';

import { db } from './database';
import { WorkerListType, WorkerProjectType, WorkerType } from '../types/worker.types';

export class WorkerRepository {
    public async searchWorkers(exclusiveStartKey = null, nickname = null) {
        // 파라미터
        const params: ScanCommandInput = {
            TableName: 'Users', // 유저 테이블 이름
            // Limit: 3,
        };

        // exclusiveStartKey 가 null 이 아니면 ExclusiveStartKey에 입력
        if (exclusiveStartKey) {
            params.ExclusiveStartKey = { userID: exclusiveStartKey };
        }

        // nickname으로 필터링
        if (nickname) {
            // 닉네임이 포함되는 것으로 필터링
            params.FilterExpression = 'contains(nickname, :nickname)';

            // 필터 표현식에서 사용될 실제 값을 매핑
            params.ExpressionAttributeValues = {
                ':nickname': nickname,
            };
        }

        try {
            // 스캔 커맨드에 파라미터 적용
            const command = new ScanCommand(params);

            // 커맨드 디비에 전송
            const response = await db.send(command);

            // 변환
            const workerTypes: WorkerType[] = [];

            const workers = response.Items;
            const lastEvaluatedKey = response.LastEvaluatedKey;

            for (const worker of workers) {
                const workerType: WorkerType = {
                    userID: worker.userID,
                    nickname: worker.nickname,
                    profile_image: worker.profileImage,
                    projectsInvolved: await this.findProjects(worker.userID),
                };
                workerTypes.push(workerType);
            }

            const workerListType: WorkerListType = {
                lastEvaluatedKey: lastEvaluatedKey ? lastEvaluatedKey : null,
                workers: workerTypes,
            };

            return workerListType;
        } catch (error) {
            console.error('Error get all workers to DynamoDB:', error);
            throw error;
        }
    }

    public async findProjects(userID: string) {
        // 파라미터
        const params: ScanCommandInput = {
            TableName: 'Projects', // 유저 테이블 이름
            FilterExpression: 'contains(workers, :userID)',
            ExpressionAttributeValues: {
                ':userID': userID,
            },
            Limit: 2,
        };

        try {
            // 스캔 커맨드에 파라미터 적용
            const command = new ScanCommand(params);

            // 커맨드 디비에 전송
            const response = await db.send(command);

            // 변환
            const workerProjects = response.Items;

            const projectsInvolved: WorkerProjectType[] = [];

            for (const workerProject of workerProjects) {
                const workerProjectType: WorkerProjectType = {
                    imgURL: workerProject.imgUrls[0],
                    progress: workerProject.progress,
                    title: workerProject.title,
                    category: workerProject.category,
                };
                projectsInvolved.push(workerProjectType);
            }

            return projectsInvolved;
        } catch (error) {
            console.error('Error get all workers to DynamoDB:', error);
            throw error;
        }
    }
}

export const workerRepository = new WorkerRepository();
