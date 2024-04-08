import { UserRole, UserType } from '../types/user.types';

export class UserRepository {
    private users: UserType[] = [];

    public addUser(kakaoId: string, nickname: string, profile_image: string, role: UserRole): UserType {
        const newUser: UserType = {
            id: kakaoId,
            nickname,
            profile_image,
            role,
        };
        this.users.push(newUser);
        return newUser;
    }
}

export const userRepository = new UserRepository();
