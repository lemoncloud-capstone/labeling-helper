import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { authenticateMiddleware } from '../middleware/AccessTokenMiddleware';

export function usersRouter(): Router {
    const router: Router = Router();

    router.get('/auth/kakao/callback', UserController.kakaoCallback);

    router.post('/updateRole', authenticateMiddleware, UserController.updateRole);

    return router;
}
