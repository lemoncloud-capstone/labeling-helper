import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { z } from 'zod';

import { UserService } from '../services/user.service';
import { UserRole } from '../types/user.types';
import { sendResponse } from '../utils/response';

dotenv.config();

// Zod를 사용한 코드 검증
const CodeSchema = z.object({
    code: z.string().min(1),
});

const UpdateRoleSchema = z.object({
    role: z.nativeEnum(UserRole),
});

export class UserController {
    public static async kakaoCallback(req: Request, res: Response): Promise<void> {
        // Zod를 사용한 req 검사
        const validationResult = CodeSchema.safeParse(req.query);
        if (!validationResult.success) {
            sendResponse(res, 2002);
            return;
        }

        const { code } = validationResult.data;

        try {
            const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_REST_API_KEY,
                    redirect_uri: process.env.KAKAO_REDIRECT_URI,
                    code,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const accessToken = tokenResponse.data.access_token;
            const userInfo = await UserService.getKakaoUserInfo(accessToken);
            const user = await UserService.addUserIfNotExist(
                userInfo.userID,
                userInfo.nickname || '',
                userInfo.profile_image || 'None',
                UserRole.None
            );

            sendResponse(res, 1000, {
                user,
            });
        } catch (error) {
            console.error(error);
            sendResponse(res, 2001);
        }
    }

    public static async updateRole(req: Request, res: Response): Promise<void> {
        const validationResult = UpdateRoleSchema.safeParse(req.body);
        if (!validationResult.success) {
            sendResponse(res, 2002);
            return;
        }

        const { role } = validationResult.data;

        try {
            await UserService.updateRole(req.userid, role);
            sendResponse(res, 1000);
        } catch (error) {
            console.error('Error updating user role:', error);
            sendResponse(res, 3003);
        }
    }
}
