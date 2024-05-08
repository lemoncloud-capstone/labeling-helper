import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { UserRole, UserType } from '../types/user.types';

export class UserRepository {
    private ddbClient;
    private tableName = 'LemonSandbox';

    constructor(ddbClient) {
        this.ddbClient = ddbClient;
    }

    public async addUser(
        kakaoId: string,
        nickname: string,
        profileImage: string,
        role: UserRole,
        refreshToken: string
    ): Promise<UserType> {
        const newUser: UserType = {
            pkey: String(kakaoId),
            skey: 'USER',
            nickname: nickname,
            profile_image: profileImage,
            role: role,
            refreshToken: refreshToken,
        };

        await this.ddbClient.send(
            new PutCommand({
                TableName: this.tableName,
                Item: newUser,
            })
        );
        return newUser;
    }

    public async updateRole(userId: number, newRole: UserRole): Promise<void> {
        await this.ddbClient.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { pkey: String(userId), skey: 'USER' },
                UpdateExpression: 'set #role = :r',
                ExpressionAttributeNames: { '#role': 'role' },
                ExpressionAttributeValues: { ':r': newRole },
            })
        );
    }

    async getUser(kakaoId: string) {
        const { Item } = await this.ddbClient.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { pkey: String(kakaoId), skey: 'USER' },
            })
        );
        return Item;
    }
}

export const userRepository = new UserRepository(ddbDocumentClient);
