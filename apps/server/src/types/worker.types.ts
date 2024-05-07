export type WorkerListType = {
    lastEvaluatedKey: Record<string, any>;
    workers: WorkerType[];
};

export type WorkerType = {
    userID: string;
    nickname: string;
    profile_image?: string;
    projectsInvolved: WorkerProjectType[];
};

export type WorkerProjectType = {
    imgURL: string;
    progress: number;
    title: string;
    category: string;
};
