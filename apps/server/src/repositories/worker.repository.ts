import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { WorkerListType, WorkerProjectType, WorkerType } from '../types/worker.types';

export class WorkerRepository {
    public async searchWorkers(exclusiveStartKey = null, nickname = null) {
        // 파라미터
        const params: ScanCommandInput = {
            TableName: 'LemonSandbox',
            // Limit: 3,
        };

        // exclusiveStartKey 가 null 이 아니면 ExclusiveStartKey에 입력
        if (exclusiveStartKey) {
            params.ExclusiveStartKey = { pkey: exclusiveStartKey };
        }

        // FilterExpression 초기화
        const filterExpressions: string[] = [];
        const expressionAttributeValues = {};

        // skey가 "USER"인 항목으로 필터링
        filterExpressions.push('skey = :skey');
        expressionAttributeValues[':skey'] = 'USER';

        // nickname으로 필터링
        if (nickname) {
            // 닉네임이 포함되는 것으로 필터링
            filterExpressions.push('contains(nickname, :nickname)');
            expressionAttributeValues[':nickname'] = nickname;
        }

        // FilterExpression과 ExpressionAttributeValues 설정
        params.FilterExpression = filterExpressions.join(' and ');
        params.ExpressionAttributeValues = expressionAttributeValues;

        try {
            // 스캔 커맨드에 파라미터 적용
            const command = new ScanCommand(params);

            // 커맨드 디비에 전송
            const response = await ddbDocumentClient.send(command);

            // 변환
            const workerTypes: WorkerType[] = [];

            const workers = response.Items;
            const lastEvaluatedKey = response.LastEvaluatedKey;

            for (const worker of workers) {
                const workerType: WorkerType = {
                    userID: worker.pkey,
                    nickname: worker.nickname,
                    profile_image: worker.profileImage,
                    projectsInvolved: await this.findProjects(worker.pkey),
                };
                workerTypes.push(workerType);
            }

            const workerListType: WorkerListType = {
                lastEvaluatedKey: lastEvaluatedKey ? lastEvaluatedKey : null,
                workers: workerTypes,
            };

            return workerListType;
        } catch (error) {
            console.error('Error get workers to DynamoDB:', error);
            throw error;
        }
    }

    public async findProjects(userID: string) {
        // 파라미터
        const params: ScanCommandInput = {
            TableName: 'LemonSandbox',
            FilterExpression: 'contains(workers, :userID) and skey = :skey',
            ExpressionAttributeValues: {
                ':userID': userID,
                ':skey': 'PROJECT',
            },
            Limit: 2,
        };

        try {
            // 스캔 커맨드에 파라미터 적용
            const command = new ScanCommand(params);

            // 커맨드 디비에 전송
            const response = await ddbDocumentClient.send(command);

            // 변환
            const workerProjects = response.Items;

            const projectsInvolved: WorkerProjectType[] = [];

            for (const workerProject of workerProjects) {
                const workerProjectType: WorkerProjectType = {
                    imgURL: workerProject.imgUrls[0],
                    progress: workerProject.progress,
                    title: workerProject.pkey.substring(1),
                    category: workerProject.category,
                };
                projectsInvolved.push(workerProjectType);
            }

            return projectsInvolved;
        } catch (error) {
            console.error('Error get worker projects to DynamoDB:', error);
            throw error;
        }
    }
}

export const workerRepository = new WorkerRepository();
