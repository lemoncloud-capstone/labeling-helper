import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRET =
    (process.env.TOKEN_SECRET as string) ||
    (() => {
        throw new Error('TOKEN_SECRET is not defined');
    })();

const EXP = 60 * 60 * 24 * 7; // 1 week

type JWTData = {
    userid: number;
};

export class JWTService {
    static generateToken(userid: number): string {
        const data: JWTData = {
            userid: userid,
        };
        return jwt.sign(data, SECRET, { expiresIn: EXP });
    }

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
