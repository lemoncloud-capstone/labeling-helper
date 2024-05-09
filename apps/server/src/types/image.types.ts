export enum Status {
    Available = 'available',
    InProgress = 'inProgress',
    Pending = 'pending',
    Completed = 'completed',
    Rework = 'rework',
}

export type ImageType = {
    pkey?: string;
    skey?: string;
    title?: string;
    imageURL?: string;
    status?: Status;
    latestTimestamp: Date;
    labels: string[];
};
