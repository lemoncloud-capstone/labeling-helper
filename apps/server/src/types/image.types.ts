export enum Status {
    Available = 'available',
    InProgress = 'inProgress',
    Pending = 'pending',
    Completed = 'completed',
    Rework = 'rework',
}

export type Point = {
    x: number | null;
    y: number | null;
};

export type LabelData = {
    leftTop: Point;
    rightTop: Point;
    leftBottom: Point;
    rightBottom: Point;
};

export type LabelPoints = {
    [label: string]: LabelData[];
};

export type ImageType = {
    pkey?: string;
    skey?: string;
    title?: string;
    imageURL?: string;
    status?: Status;
    latestTimestamp: number;
    labelPoints: LabelPoints;
};
