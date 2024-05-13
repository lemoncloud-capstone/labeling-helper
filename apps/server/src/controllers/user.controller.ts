import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { z } from 'zod';

import { UserService } from '../services/user.service';
import { UserRole } from '../types/user.types';
import { BaseResponseCode, BaseResponseMessages } from '../utils/errors';
import { sendResponse } from '../utils/response';

dotenv.config();

// Zod를 사용한 코드 검증
const CodeSchema = z.object({
    code: z.string().min(1),
});
const KakaoTokenSchema = z.object({
    code: z.string().min(1),
    from: z.string().min(1),
});

const UpdateRoleSchema = z.object({
    role: z.nativeEnum(UserRole),
});

export class UserController {
    public static async kakaoCallback(req: Request, res: Response): Promise<void> {
        // Zod를 사용한 req 검사
        const validationResult = CodeSchema.safeParse(req.query);
        if (!validationResult.success) {
            sendResponse(res, BaseResponseCode.ValidationError);
            return;
        }

        const { code } = validationResult.data;
        sendResponse(res, BaseResponseCode.SUCCESS, BaseResponseMessages[BaseResponseCode.SUCCESS], {
            code,
        });
        /*
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

            const kakaoToken = tokenResponse.data.access_token;

            const userInfo = await UserService.getKakaoUserInfo(kakaoToken);
            const user = await UserService.addUserIfNotExist(
                userInfo.userID,
                userInfo.nickname || '',
                userInfo.profile_image || 'None',
                UserRole.None
            );
            sendResponse(res, BaseResponseCode.SUCCESS, BaseResponseMessages[BaseResponseCode.SUCCESS], {
                code
            });
         } catch (error) {
             sendResponse(res, BaseResponseCode.GET_OAUTH_INFO_FAILED, error.message);
         }
        */
    }

    public static async getKakaoToken(req: Request, res: Response): Promise<void> {
        // Zod를 사용한 req 검사
        const validationResult = KakaoTokenSchema.safeParse(req.query);
        if (!validationResult.success) {
            sendResponse(res, BaseResponseCode.ValidationError);
            return;
        }

        console.log(validationResult.data.code);

        const { code, from } = validationResult.data;

        let redirect_uri = process.env.KAKAO_REDIRECT_URI;
        console.log(redirect_uri);
        if (from == 'web') {
            redirect_uri = process.env.KAKAO_REDIRECT_URI_WEB;
        }

        try {
            const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_REST_API_KEY,
                    redirect_uri: redirect_uri,
                    code,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const kakaoToken = tokenResponse.data.access_token;

            const userInfo = await UserService.getKakaoUserInfo(kakaoToken);
            console.log(userInfo);
            const user = await UserService.addUserIfNotExist(
                userInfo.userID,
                userInfo.nickname || '',
                userInfo.profile_image || 'None',
                UserRole.None
            );
            sendResponse(res, BaseResponseCode.SUCCESS, BaseResponseMessages[BaseResponseCode.SUCCESS], {
                user,
            });
        } catch (error) {
            sendResponse(res, BaseResponseCode.GET_OAUTH_INFO_FAILED, error.message);
        }
    }

    public static async updateRole(req: Request, res: Response): Promise<void> {
        const validationResult = UpdateRoleSchema.safeParse(req.body);
        if (!validationResult.success) {
            sendResponse(res, BaseResponseCode.ValidationError);
            return;
        }

        const { role } = validationResult.data;

        try {
            await UserService.updateRole(req.userid, role);
            sendResponse(res, BaseResponseCode.SUCCESS);
        } catch (error) {
            sendResponse(res, BaseResponseCode.FAIL_TO_UPDATE_ROLE, error.message);
        }
    }
}
