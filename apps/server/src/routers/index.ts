import { Router } from 'express';

import { labelingRouter } from './labeling.router';
import { projectsRouter } from './project.router';
import { usersRouter } from './user.router';
import { workersRouter } from './worker.router';

const router: Router = Router();

router.use('/users', usersRouter());
router.use('/workers', workersRouter());
router.use('/projects', projectsRouter());
router.use('/labels', labelingRouter());

export default router;
