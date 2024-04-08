import { Router } from 'express';

import { UserController } from '../controllers/UserController';

export function usersRouter(): Router {
    const router: Router = Router();

    router.get('/auth/kakao/callback', UserController.kakaoCallback);

    router.post('updateRole', UserController.updateRole);

    return router;
}
