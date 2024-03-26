import { CreateUserDto, User } from '@labeling-helper/models';

import { UsersService } from '../services/users.service';

export class UsersController {
    private readonly usersService: UsersService;

    constructor() {
        this.usersService = new UsersService();
    }

    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    createUser(user: CreateUserDto): User {
        return this.usersService.create(user);
    }
}
