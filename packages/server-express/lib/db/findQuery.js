import { connectDb, dbName, client, resultsCollection } from './connect.js';
export const findOneQueryResult = async (searchPhrase) => {
    try {
        await connectDb();
        const resultsCol = await client.db(dbName).collection(resultsCollection);
        console.info(`Connect to 'results' collection in '${dbName}'`);
        const found = await resultsCol.findOne({ searchPhrase: searchPhrase });
        if (!found)
            return;
        return found.serviceResults;
        console.info(`Success. Found query: ${JSON.stringify(found)}'`);
    }
    catch (error) {
        console.error('Error creating collection to DB', error);
    }
    finally {
        await client.close();
        console.info(`Closing connection db 🛬: ${dbName}`);
    }
};
