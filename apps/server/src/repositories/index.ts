import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const dynamoDBClient = new DynamoDBClient({
    region: process.env.REGION,
    endpoint: process.env.LOCAL_ENDPOINT,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

const ddbDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);

export { ddbDocumentClient };
