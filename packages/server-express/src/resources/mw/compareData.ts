import { Request, Response, NextFunction } from 'express';
import { testData } from '../../data-model/testData.js';
import { TestData } from '../../utils/shared-types.js';
import { callPythonServices } from './getPythonServices.js';
import { callJavascriptServices } from './getJsServices.js';
import { insertOneQueryResult } from '../../db/addResult.js';
import { findOneQueryResult } from '../../db/findQuery.js';

/**
 * new comparison on testData
 */
export default async function compareData (req: Request, res: Response, _next: NextFunction) {
  const collection = req.query.collection as string
  if (!collection){
    throw new Error('Error parsing collection name from req query')
  }
  const allResults = []
  let count = 0
  for (const data of testData as TestData){
    const { langCode, phrases } = data
    const sourceLang = langCode
    for (const phrase of phrases){
      const text = phrase
      console.info('collection', collection)
      console.log('Loop count', ++count)
      const possibleResults = await findOneQueryResult(text, collection)
      if (possibleResults) continue
      const pyhtonResults = await callPythonServices(text, sourceLang)
      const jsServicesResults = await callJavascriptServices(text, sourceLang)
      const allServiceResults = { ...pyhtonResults, ...jsServicesResults }
      const inserted = await insertOneQueryResult(text, allServiceResults, collection)
      allResults.push(inserted)
    }
  }
  res.json(allResults.filter(r => !!r))
  res.status(201)
  res.end()
}