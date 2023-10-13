import { ObjectId } from 'mongodb';
import { DocModel, TranslationResult } from '../utils/shared-types.js';
import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js'

export const updateOneDoc = async (translationResult: TranslationResult, docId: ObjectId) => {
  const collectionToUpdate = 'with_source_lang' || resultsCollection
  try {
    await connectDb()
    const resultsCol = await client.db(dbDetectionServices).collection<DocModel>(collectionToUpdate)
    console.info(`Connect to '${collectionToUpdate}' collection in '${dbDetectionServices}'`)
    const updatedDoc = await resultsCol.updateOne(
      { _id: docId },
      { $set: { "serviceResults.socialhub": translationResult }}
    )
    if (!updatedDoc) return
    console.info(`Success. updated doc: ${JSON.stringify(updatedDoc)}'`)
    return updatedDoc
  } catch (error) {
    console.error(`Error updating doc in '${collectionToUpdate}' collection to DB`, error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbDetectionServices}`)
  }
}