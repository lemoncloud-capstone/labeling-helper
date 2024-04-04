import { Router } from 'express';

import { usersRouter } from './UserRouter';

const router: Router = Router();

router.use('/users', usersRouter());

export default router;
