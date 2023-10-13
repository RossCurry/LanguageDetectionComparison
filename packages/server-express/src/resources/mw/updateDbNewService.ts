import { Request, Response, NextFunction } from 'express';
import { getAllDocs } from '../../db/getAllDocs.js';
import detectSocialHub from '../../services/socialhub.js';
import { updateOneDoc } from '../../db/updateDoc.js';
import detectFasttext from '../../services/fasttext-lid.js';
import { ServiceNames, services } from '../../services/index.js';

export default async function updateDbNewService(req: Request, res: Response, next: NextFunction) {
  let { collection, service } = req.query
  collection = collection && typeof collection === 'string' ? collection : undefined;
  service = service && typeof service === 'string' ? service : undefined;
  if (!service || !services.some(s => s.name === service)) throw new Error(
    `Service name provided doenst match one of existing services: ${services.map(s => s.name)}`
  )
  const serviceName = service as ServiceNames as any
  // getList of all docs
  const allDocs = await getAllDocs(collection)
  if (!allDocs) throw new Error('Error getting all docs from DB')
  const shResults = []
  for (const doc of allDocs) {
    const detectionResults = await services[serviceName] .fn(doc.searchPhrase)
    detectionResults.matchesDeepL = doc.serviceResults.deepl?.detectedLang === detectionResults.detectedLang
    detectionResults.sourceLang = doc.serviceResults.deepl?.sourceLang
    if (!doc._id) throw new Error(`Error: doc has no _id field: ${doc}`)
    // update all docs to include social hub service
    const updatedDoc = await updateOneDoc(detectionResults, doc._id)
    shResults.push(updatedDoc)
  }
  res.send(shResults)
  res.status(200)
}