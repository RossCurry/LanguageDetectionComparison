import { DocModel, TranslationResult } from '../utils/shared-types.js';
import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js'

export const findOneQueryResult = async (searchPhrase: string) => {
  try {
    await connectDb()
    const resultsCol = await client.db(dbDetectionServices).collection(resultsCollection)
    console.info(`Connect to '${resultsCollection}' collection in '${dbDetectionServices}'`)
    const found = await resultsCol.findOne<DocModel>({ searchPhrase: searchPhrase })
    if (!found) return
    console.info(`Success. Found query: ${JSON.stringify(found)}'`)
    return found.serviceResults
  } catch (error) {
    console.error(`Error findingOne in '${resultsCollection}' collection to DB`, error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbDetectionServices}`)
  }
}