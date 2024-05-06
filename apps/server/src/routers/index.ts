import { Router } from 'express';

import { projectsRouter } from './project.router';
import { usersRouter } from './user.router';

const router: Router = Router();

router.use('/users', usersRouter());
router.use('/projects', projectsRouter());

export default router;
