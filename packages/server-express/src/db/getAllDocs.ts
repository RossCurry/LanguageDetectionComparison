import { ObjectId } from 'mongodb';
import { DocModel, TranslationResult } from '../utils/shared-types.js';
import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js'



export const getAllDocs = async (): Promise<(DocModel & {
  _id: ObjectId;
})[] | undefined> => {
  try {
    await connectDb()
    const resultsCol = await client.db(dbDetectionServices).collection(resultsCollection)
    console.info(`Connect to '${resultsCollection}' collection in '${dbDetectionServices}'`)
    const allDocs = await resultsCol.find<DocModel & { _id: ObjectId }>({}).toArray()
    if (!allDocs) return
    console.info(`Success. Got all Search Phrases: ${JSON.stringify(allDocs)}'`)
    return allDocs
  } catch (error) {
    console.error(`Error Got all Search Phrases in '${resultsCollection}' collection to DB`, error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbDetectionServices}`)
  }
}