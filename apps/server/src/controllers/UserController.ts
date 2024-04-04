import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

import { UserService } from '../services/UserService';
import { sendResponse } from '../utils/response';

dotenv.config();

export class UserController {
    public static async kakaoCallback(req: Request, res: Response): Promise<void> {
        const code = req.query.code as string;

        if (!code) {
            res.status(400).json({ message: 'Code is required' });
            return;
        }

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
                userInfo.profile_image || 'None'
            );

            sendResponse(res, 200, 'User successfully logged in/registered', user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
