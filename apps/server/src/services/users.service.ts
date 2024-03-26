import { CreateUserDto, User } from '@labeling-helper/models';

export class UsersService {
    private readonly users: User[] = [];

    create(user: CreateUserDto): User {
        const { name, age } = user;
        const newUser: User = { name, age, createdAt: new Date() };
        this.users.push(newUser);
        return newUser;
    }

    findAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.users);
            } catch (err) {
                reject(err);
            }
        });
    }
}
