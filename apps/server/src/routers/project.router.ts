import { Router } from 'express';

import { ImgController } from '../controllers/img.controller';
import { ProjectController } from '../controllers/project.controller';
import { authenticateMiddleware } from '../middleware/accessToken.middleware';

export function projectsRouter(): Router {
    const router: Router = Router();

    router.post('/', authenticateMiddleware, ProjectController.createProject);
    router.post('/fetchProjects', ProjectController.getProjects);
    router.post('/:title/images', ImgController.getProjectImages);
    router.post('/:title/images/:imgURL', ImgController.updateStatus);
    // router.post('/:title/images', authenticateMiddleware, ImgController.getProjectImages);
    // router.post('/:title/images/:imgURL', authenticateMiddleware, ImgController.updateStatus);

    return router;
}
