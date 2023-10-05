import { Request, Response, NextFunction } from 'express';
import { getAllDocs } from '../../db/getAllDocs.js';
import detectSocialHub from '../../services/socialhub.js';
import { updateOneDoc } from '../../db/updateDoc.js';

export default async function updateDbNewService (req: Request, res: Response, next: NextFunction) {
  // getList of all docs
  const allDocs = await getAllDocs()
  if (!allDocs) throw new Error('Error getting all docs from DB')
  const shResults = []
  for (const doc of allDocs) {
    // call socialhub service for each phrase
    const shResult = await detectSocialHub(doc.searchPhrase)
    // include deepl match field
    shResult.matchesDeepL = doc.serviceResults.deepl?.detectedLang === shResult.detectedLang
    if (!doc._id) throw new Error(`Error: doc has no _id field: ${doc}`)
    // update all docs to include social hub service
    const updatedDoc = await updateOneDoc(shResult, doc._id)
    shResults.push(updatedDoc)
  }
  res.send(shResults)
  res.status(200)
}