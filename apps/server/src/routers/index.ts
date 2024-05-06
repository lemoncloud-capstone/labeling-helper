import { Router } from 'express';

import { usersRouter } from './user.router';
import { workersRouter } from './worker.router';

const router: Router = Router();

router.use('/users', usersRouter());
router.use('/workers', workersRouter());

export default router;
