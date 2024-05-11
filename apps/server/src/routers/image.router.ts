import { Router } from 'express';

import { ImageController } from '../controllers/image.controller';

export function imageRouter(): Router {
    const router: Router = Router();

    router.get('/', ImageController.getS3Images);

    return router;
}
