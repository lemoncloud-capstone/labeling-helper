import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocumentClient } from './index';
import { UserRole, UserType } from '../types/user.types';

export class UserRepository {
    private ddbClient;
    private tableName = 'Users';

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
            userID: String(kakaoId),
            nickname: nickname,
            profile_image: profileImage,
            role: role,
            refreshToken: refreshToken,
        };

        try {
            await this.ddbClient.send(
                new PutCommand({
                    TableName: this.tableName,
                    Item: newUser,
                })
            );
            console.log('User added to DynamoDB:', newUser);
            return newUser;
        } catch (error) {
            console.error('Error adding user to DynamoDB:', error);
            throw error;
        }
    }

    public async updateRole(userId: number, newRole: UserRole): Promise<void> {
        try {
            await this.ddbClient.send(
                new UpdateCommand({
                    TableName: this.tableName,
                    Key: { userID: String(userId) },
                    UpdateExpression: 'set #role = :r',
                    ExpressionAttributeNames: { '#role': 'role' },
                    ExpressionAttributeValues: { ':r': newRole },
                })
            );
            console.log(`User role updated: ${userId} -> ${newRole}`);
        } catch (error) {
            console.error('Error updating user role in DynamoDB:', error);
            throw error;
        }
    }

    async getUser(kakaoId: string) {
        try {
            const { Item } = await this.ddbClient.send(
                new GetCommand({
                    TableName: this.tableName,
                    Key: { userID: String(kakaoId) },
                })
            );
            return Item;
        } catch (error) {
            console.error('Error fetching user from DynamoDB:', error);
            throw error;
        }
    }
}

export const userRepository = new UserRepository(ddbDocumentClient);
