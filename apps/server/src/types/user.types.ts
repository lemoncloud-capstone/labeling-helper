export enum UserRole {
    Admin = 'admin',
    Reviewer = 'reviewer',
    None = 'none',
}

export type UserType = {
    id: string;
    nickname: string;
    profile_image?: string;
    role?: UserRole;
};

export type KakaoProfile = {
    id: string;
    nickname?: string;
    profile_image?: string;
};
