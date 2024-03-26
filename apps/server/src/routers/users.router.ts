import { CreateUserDto, User } from '@labeling-helper/models';
import { Request, Response, Router } from 'express';

import { UsersController } from '../controllers/users.controller';

export function usersRouter(): Router {
    const router: Router = Router();
    const usersController = new UsersController();

    /**
     * Get All Users
     *
     * $ http GET ':3000/users'
     */
    router.get('/', async (req: Request, res: Response) => {
        try {
            const users = await usersController.findAll();
            res.send(users).status(200);
        } catch (err) {
            res.send(err).status(503);
        }
    });

    /**
     * Create new user from body
     *
     * $ cat apps/server/src/assets/create.user.json | http POST ':3000/users/create'
     */
    router.post('/create', (req: Request, res: Response) => {
        try {
            const userData: CreateUserDto = req.body;
            const newUser: User = usersController.createUser(userData);
            res.send(newUser).status(200);
        } catch (err) {
            res.send(err).status(503);
        }
    });

    return router;
}
