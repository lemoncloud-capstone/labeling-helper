import { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { authenticateMiddleware } from '../middleware/accessToken.middleware';

export function usersRouter(): Router {
    const router: Router = Router();

    router.get('/auth/kakao/callback', UserController.kakaoCallback);

    router.post('/role', authenticateMiddleware, UserController.updateRole);

    return router;
}
