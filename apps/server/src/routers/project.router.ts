import { Router } from 'express';

import { ImgController } from '../controllers/img.controller';
import { ProjectController } from '../controllers/project.controller';

export function projectsRouter(): Router {
    const router: Router = Router();

    router.post('/', ProjectController.createProject);
    router.post('/fetchProjects', ProjectController.getProjects);
    router.post('/images', ImgController.getProjectImages);
    router.post('/images/status', ImgController.updateStatus);
    router.post('/workers', ProjectController.assignWorkers);
    // router.post('/:title/images', authenticateMiddleware, ImgController.getProjectImages);
    // router.post('/:title/images/:imgURL', authenticateMiddleware, ImgController.updateStatus);

    return router;
}
