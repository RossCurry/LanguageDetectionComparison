import { DocModel, TranslationResult } from '../utils/shared-types.js';
import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js'


export const getAllSearchPhrases = async (): Promise<string[] | undefined> => {
  try {
    await connectDb()
    const resultsCol = await client.db(dbDetectionServices).collection(resultsCollection)
    console.info(`Connect to '${resultsCollection}' collection in '${dbDetectionServices}'`)
    const allSearchPhrases = await resultsCol.find<DocModel>({}).project({ _id: 0, searchPhrase: 1 }).toArray()
    if (!allSearchPhrases) return
    console.info(`Success. Got all Search Phrases: ${JSON.stringify(allSearchPhrases)}'`)
    return allSearchPhrases.map( phrase => phrase.searchPhrase ) 
  } catch (error) {
    console.error(`Error Got all Search Phrases in '${resultsCollection}' collection to DB`, error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbDetectionServices}`)
  }
}