import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { UserRole, UserType } from '../types/user.types';

export class UserRepository {
    private ddbClient: DynamoDBDocumentClient;
    private tableName: string = 'Users';

    constructor() {
        const dynamoDBClient = new DynamoDBClient({ region: '우리 리전' });
        this.ddbClient = DynamoDBDocumentClient.from(dynamoDBClient);
    }

    public async addUser(kakaoId: string, nickname: string, profileImage: string, role: UserRole): Promise<UserType> {
        const newUser: UserType = {
            id: kakaoId,
            nickname,
            profile_image: profileImage,
            role,
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
                    Key: { id: userId },
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
}

export const userRepository = new UserRepository();
