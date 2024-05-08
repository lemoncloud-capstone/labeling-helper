import { ddbDocumentClient } from './index';

export class LabelingRepository {
    private ddbClient;
    private tableName = 'LemonSandbox';

    constructor(ddbClient) {
        this.ddbClient = ddbClient;
    }
}
export const labelRepository = new LabelingRepository(ddbDocumentClient);
