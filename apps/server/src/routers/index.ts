import { Router } from 'express';

import { labelingRouter } from './labeling.router';
import { projectsRouter } from './project.router';
import { usersRouter } from './user.router';

const router: Router = Router();

router.use('/users', usersRouter());
router.use('/projects', projectsRouter());
router.use('/labels', labelingRouter());

export default router;
