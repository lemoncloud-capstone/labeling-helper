import { GetCommand, GetCommandInput, ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';

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
                    projectsInvolved: await this.findProjects(worker.projectsInvolved),
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

    public async findProjects(projectsInvolved: string[]) {
        if (!projectsInvolved) {
            return null;
        }

        try {
            const result: WorkerProjectType[] = [];

            for (const projectTitle of projectsInvolved) {
                const params: GetCommandInput = {
                    TableName: 'LemonSandbox',
                    Key: { pkey: String(projectTitle), skey: 'PROJECT' },
                };

                const command = new GetCommand(params);

                // 커맨드 디비에 전송
                const response = await ddbDocumentClient.send(command);

                const workerProject = response.Item;

                const workerProjectType: WorkerProjectType = {
                    imgURL: workerProject.imgUrls[0],
                    progress: workerProject.progress,
                    title: workerProject.pkey.substring(1),
                    category: workerProject.category,
                };

                result.push(workerProjectType);
            }

            return result;
        } catch (error) {
            console.error('Error get worker projects to DynamoDB:', error);
            throw error;
        }
    }

    public async getAssignedWorkers(projectId: string) {
        const pkey = 'P' + projectId;
        const params: GetCommandInput = {
            TableName: 'LemonSandbox',
            Key: { pkey: pkey, skey: 'PROJECT' },
        };

        try {
            const command = new GetCommand(params);

            // 커맨드 디비에 전송
            const response = await ddbDocumentClient.send(command);

            const project = response.Item;

            const workers = project.workers;

            return workers;
        } catch (error) {
            console.error('Error get assigned workers to DynamoDB:', error);
            throw error;
        }
    }
}

export const workerRepository = new WorkerRepository();
