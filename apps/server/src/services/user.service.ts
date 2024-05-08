import axios from 'axios';
import dotenv from 'dotenv';

import { JwtService } from './jwt.service';
import { userRepository } from '../repositories/user.repository';
import { UserRole, UserType } from '../types/user.types';

dotenv.config();

export class UserService {
    private static kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';

    public static async getKakaoUserInfo(accessToken: string): Promise<UserType> {
        try {
            const response = await axios.get(this.kakaoUserInfoUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return {
                userID: response.data.id,
                nickname: response.data.properties.nickname,
                profile_image: response.data.properties.profile_image,
            };
        } catch (error) {
            throw new Error('Failed to fetch user info from Kakao');
        }
    }

    public static async addUserIfNotExist(
        kakaoId: string,
        nickname: string,
        profile_image: string,
        role: UserRole
    ): Promise<UserType> {
        // JWT accessToken 생성
        const internalUserId = parseInt(kakaoId);
        const jwtToken = JwtService.generateAccessToken(internalUserId);
        const user = await userRepository.getUser(kakaoId);

        if (user) {
            return { ...user, accessToken: jwtToken };
        }

        // refreshToken 생성
        const refreshToken = JwtService.generateRefreshToken(internalUserId);
        const newUser = await userRepository.addUser(kakaoId, nickname, profile_image, role, refreshToken);

        return { ...newUser, accessToken: jwtToken };
    }

    static async updateRole(userId: number, role: UserRole) {
        try {
            return userRepository.updateRole(userId, role);
        } catch {
            throw new Error('Failed to update role');
        }
    }
}
