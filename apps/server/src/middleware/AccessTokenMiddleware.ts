import { NextFunction, Request, Response } from 'express';

import { JWTService } from '../services/JWTService';

export const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Authorization format is Bearer <token>.' });
    }

    const token = parts[1];
    const { ok, userid } = JWTService.parseToken(token);

    if (!ok) {
        return res.status(403).json({ message: 'Invalid or expired authorization token.' });
    }

    req.userid = userid;
    next();
};
