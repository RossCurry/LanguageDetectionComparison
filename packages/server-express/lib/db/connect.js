import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_CONNECT;
if (!uri)
    throw new Error('No URI, not URL to connect to mongoDB');
export const client = new MongoClient(uri);
export const projectName = 'LanguageDetection';
export const dbName = 'detection_services';
export const resultsCollection = 'service_results';
export const connectDb = async () => {
    // A single mongo client connectiong should be used for each life cycle of an App
    await client.connect();
    console.info(`Connected to db 🚀: '${dbName}'`);
};
