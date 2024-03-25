export function utils(): string {
    return 'utils';
}

export const createAsyncDelay = async (seconds: number) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), seconds);
    });
};
