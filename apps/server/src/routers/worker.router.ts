import { Router } from 'express';

import { WorkerController } from '../controllers/worker.controller';

export function workersRouter(): Router {
    const router: Router = Router();

    router.get('/', WorkerController.workerList);
    router.get('/search', WorkerController.workerList);

    return router;
}
