import { TranslationResult } from '../services/deepl.js'
import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js'


type ServicesResponse =  {
  chardet: TranslationResult | null;
  fasttext: TranslationResult | null;
  franc: TranslationResult | null;
  deepl: TranslationResult | null;
  langid: TranslationResult;
  langdetect: TranslationResult;
}
type DocModel = {
  searchPhrase: string;
  wordCount: number;
  characterCount: number;
  serviceResults: ServicesResponse
}
export const findOneQueryResult = async (searchPhrase: string) => {
  try {
    await connectDb()
    const resultsCol = await client.db(dbDetectionServices).collection(resultsCollection)
    console.info(`Connect to 'results' collection in '${dbDetectionServices}'`)
    const found = await resultsCol.findOne<DocModel>({ searchPhrase: searchPhrase })
    if (!found) return
    console.info(`Success. Found query: ${JSON.stringify(found)}'`)
    return found.serviceResults
  } catch (error) {
    console.error('Error creating collection to DB', error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbDetectionServices}`)
  }
}