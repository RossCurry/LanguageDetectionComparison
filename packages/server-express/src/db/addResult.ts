import { Collection } from 'mongodb';
import { DocModel, ServicesResponse, TranslationResult } from '../utils/shared-types.js';
import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js'



export const insertOneQueryResult = async (searchPhrase: string, queryResponse: ServicesResponse, dbCollection?: string) => {
  const collection = dbCollection || resultsCollection
  const entry: DocModel = {
    searchPhrase: searchPhrase,
    wordCount: searchPhrase.split(" ").length,
    characterCount: searchPhrase.length,
    serviceResults: queryResponse,
    sourceLang: queryResponse.deepl?.sourceLang
  }
  try {
    await connectDb()
    // createCollection creates new or returns existing collections.
    let resultsCol: Collection<DocModel> | undefined;
    try {
      resultsCol = await client.db(dbDetectionServices).createCollection<DocModel>(collection)
    } catch (error) {
      if (!(error as Error).message.includes('already exists')) throw error
    }
    resultsCol = await client.db(dbDetectionServices).collection<DocModel>(collection)
    if (!resultsCol) throw new Error('No collection return by mongo')
    console.info(`Connect to '${collection}' collection in '${dbDetectionServices}'`)
    const savedResult = await resultsCol.insertOne(entry)
    console.info(`Success. Added query: ${JSON.stringify(savedResult)}'`)
    return { savedResult, doc: entry }
  } catch (error) {
    console.error('Error adding query to DB', error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbDetectionServices}`)
  }
}