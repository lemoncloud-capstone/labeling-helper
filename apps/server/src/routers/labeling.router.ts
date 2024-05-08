import { Router } from 'express';

import { authenticateMiddleware } from '../middleware/accessToken.middleware';

export function labelingRouter(): Router {
    const router: Router = Router();

    router.post('/', authenticateMiddleware);

    return router;
}
