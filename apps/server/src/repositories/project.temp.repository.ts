import {
    DeleteCommand,
    DeleteCommandInput,
    GetCommand,
    GetCommandInput,
    UpdateCommand,
    UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';

export class ProjectTempRepository {
    public async deleteProject(title: string) {
        const getProjectParams: GetCommandInput = {
            TableName: 'LemonSandbox',
            Key: { pkey: 'P' + title, skey: 'PROJECT' },
        };

        // 스캔 커맨드에 파라미터 적용
        const command = new GetCommand(getProjectParams);

        // 커맨드 디비에 전송
        const response = await ddbDocumentClient.send(command);

        const project = response.Item;
        if (!project) {
            throw new Error('제목이 ' + title + '인 프로젝트가 존재하지 않습니다.');
        }

        // 유저 projectsInvolved에서 에서 프로젝트 삭제
        for (const worker of project.workers) {
            const userID = worker.id;

            // 회원 찾아서 projectsInvolved에서 title의 index 찾기
            const getWorkerParams: GetCommandInput = {
                TableName: 'LemonSandbox',
                Key: { pkey: userID, skey: 'USER' },
            };

            const getWorkerCommand = new GetCommand(getWorkerParams);
            const response = await ddbDocumentClient.send(getWorkerCommand);
            const user = response.Item;
            const index = user.projectsInvolved.findIndex(titleIndex => titleIndex === title);

            if (index != -1) {
                // 회원 projectsInvolved에서 title의 index로 title 제거
                const updateWorkerParam: UpdateCommandInput = {
                    TableName: 'LemonSandbox',
                    Key: { pkey: userID, skey: 'USER' },
                    UpdateExpression: `REMOVE projectsInvolved[${index}]`,
                };

                const updateProjectCommand = new UpdateCommand(updateWorkerParam);
                await ddbDocumentClient.send(updateProjectCommand);
            }
        }

        // 프로젝트 삭제
        const projectDeleteParams: DeleteCommandInput = {
            TableName: 'LemonSandbox',
            Key: { pkey: 'P' + title, skey: 'PROJECT' },
        };

        const projectDeleteCommand = new DeleteCommand(projectDeleteParams);

        await ddbDocumentClient.send(projectDeleteCommand);

        // 프로젝트 이미지 삭제
        const imgUrls = project.imgUrls;

        for (const imgUrl of imgUrls) {
            const imageDeleteParams: DeleteCommandInput = {
                TableName: 'LemonSandbox',
                Key: { pkey: 'I' + title, skey: imgUrl },
            };

            const projectDeleteCommand = new DeleteCommand(imageDeleteParams);
            await ddbDocumentClient.send(projectDeleteCommand);
        }
    }
}

export const projectTempRepository = new ProjectTempRepository();
