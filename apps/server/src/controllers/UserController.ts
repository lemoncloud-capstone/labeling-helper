import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { z } from 'zod';

import { JWTService } from '../services/JWTService';
import { UserService } from '../services/UserService';
import { UserRole } from '../types/user.types';
import { sendResponse } from '../utils/response';

dotenv.config();

// Zod를 사용한 코드 검증
const CodeSchema = z.object({
    code: z.string().min(1, { message: 'Code is required' }),
});

export class UserController {
    public static async kakaoCallback(req: Request, res: Response): Promise<void> {
        // Zod를 사용한 req 검사
        const validationResult = CodeSchema.safeParse(req.query);
        if (!validationResult.success) {
            res.status(400).json({ message: 'Code is required' });
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
                userInfo.id,
                userInfo.nickname || '',
                userInfo.profile_image || 'None',
                UserRole.None
            );

            const internalUserId = parseInt(userInfo.id);

            // JWT accessToken 생성
            const jwtToken = JWTService.generateToken(internalUserId);

            sendResponse(res, 200, 'User successfully logged in', { user, accessToken: jwtToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
