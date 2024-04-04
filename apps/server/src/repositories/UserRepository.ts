interface User {
    id: string;
    nickname: string;
    profile_image?: string;
}

export class UserRepository {
    private users: User[] = [];

    public addUser(kakaoId: string, nickname: string, profile_image: string): User {
        const newUser: User = {
            id: kakaoId,
            nickname,
            profile_image,
        };
        this.users.push(newUser);
        return newUser;
    }
}

export const userRepository = new UserRepository();
