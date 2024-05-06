export enum status {
    /*available || inProgress || pending || completed || rework*/
    available = 'available',
    inProgress = 'inProgress',
    pending = 'pending',
    completed = 'completed',
    rework = 'rework',
}

export type ProjectType = {
    imgUrls: string[];
    title: string;
    category: string;
    labels: string[];
    progress: number;
    workers: string[];
};

export type ProjectListType = {
    imgURL: string;
    progress: number;
    title: string;
    category: string;
};

export type ProjectQueryParams = {
    status?: string;
    category?: string;
    keyword?: string;
    lastEvaluatedKey?: any;
};
