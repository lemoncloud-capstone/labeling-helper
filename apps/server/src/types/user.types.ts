export enum UserRole {
    Admin = 'admin',
    Reviewer = 'reviewer',
    None = 'none',
}

export type UserType = {
    userID: string;
    nickname: string;
    profile_image?: string;
    role?: UserRole;
    refreshToken?: string;
    accessToken?: string;
};

export type JWTData = {
    userid: number;
};
