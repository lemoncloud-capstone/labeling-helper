import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { JWTData } from '../types/user.types';

dotenv.config();

const SECRET =
    (process.env.TOKEN_SECRET as string) ||
    (() => {
        throw new Error('TOKEN_SECRET is not defined');
    })();

const EXP = 60 * 60 * 24; // 하루
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 30; // 30일

export class JwtService {
    // AccessToken 생성
    static generateAccessToken(userid: number): string {
        const data: JWTData = {
            userid,
        };
        return jwt.sign(data, SECRET, { expiresIn: EXP });
    }

    // RefreshToken 생성
    static generateRefreshToken(userid: number): string {
        const data: JWTData = {
            userid,
        };
        return jwt.sign(data, SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    }

    // 토큰 파싱 후 userid를 반환하도록
    static parseToken(token: string): { ok: boolean; userid: number } {
        try {
            const decoded = jwt.verify(token, SECRET) as JWTData;
            if (!decoded.userid) {
                throw new Error('Failed to verify token');
            }
            return { ok: true, userid: decoded.userid };
        } catch {
            return { ok: false, userid: 0 };
        }
    }
}
