import { TranslationResult } from '../services/deepl.js'
import { connectDb, dbName, client, resultsCollection } from './connect.js'


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
    const resultsCol = await client.db(dbName).collection(resultsCollection)
    console.info(`Connect to 'results' collection in '${dbName}'`)
    const found = await resultsCol.findOne<DocModel>({ searchPhrase: searchPhrase })
    if (!found) return
    return found.serviceResults
    console.info(`Success. Found query: ${JSON.stringify(found)}'`)
  } catch (error) {
    console.error('Error creating collection to DB', error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbName}`)
  }
}