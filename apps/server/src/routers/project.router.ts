import { Router } from 'express';

import { ImgController } from '../controllers/img.controller';
import { ProjectController } from '../controllers/project.controller';
import { ProjectTempController } from '../controllers/project.temp.controller';

export function projectsRouter(): Router {
    const router: Router = Router();

    router.post('/', ProjectController.createProject);
    router.post('/fetchProjects', ProjectController.getProjects);
    router.post('/images', ImgController.getProjectImages);
    router.post('/images/status', ImgController.updateStatus);
    router.post('/workers', ProjectController.assignWorkers);
    router.post('/approval', ProjectController.approvalProject);
    router.delete('/', ProjectTempController.deleteProject);

    return router;
}
