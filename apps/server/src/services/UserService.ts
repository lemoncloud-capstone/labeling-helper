import axios from 'axios';
import dotenv from 'dotenv';

import { userRepository } from '../repositories/UserRepository';
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
                id: response.data.id,
                nickname: response.data.properties.nickname,
                profile_image: response.data.properties.profile_image,
            };
        } catch (error) {
            console.error('Error fetching user info from Kakao:', error);
            throw new Error('Failed to fetch user info from Kakao');
        }
    }

    public static async addUserIfNotExist(
        kakaoId: string,
        nickname: string,
        profile_image: string,
        role: UserRole
    ): Promise<UserType> {
        return userRepository.addUser(kakaoId, nickname, profile_image, role);
    }
}
