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
export const insertOneQueryResult = async (searchPhrase: string, queryResponse: ServicesResponse) => {
  const entry: DocModel = {
    searchPhrase: searchPhrase,
    wordCount: searchPhrase.split(" ").length,
    characterCount: searchPhrase.length,
    serviceResults: queryResponse
  }
  try {
    await connectDb()
    const resultsCol = await client.db(dbName).collection(resultsCollection)
    console.info(`Connect to 'results' collection in '${dbName}'`)
    const savedResult = await resultsCol.insertOne(entry)
    console.info(`Success. Added user: ${JSON.stringify(savedResult)}'`)
  } catch (error) {
    console.error('Error creating collection to DB', error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbName}`)
  }
}