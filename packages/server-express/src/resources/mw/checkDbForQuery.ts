import { Request, Response, NextFunction } from 'express';
import { findOneQueryResult } from '../../db/findQuery.js';
import { sortByProcessingTime } from './getJsServices.js';

export default async function checkDbForQuery(req: Request, res: Response, next: NextFunction) {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  // Check DB for matching Query first
  const possibleResults = await findOneQueryResult(text)
  if (possibleResults) {
    res.send({
      servicesSorted: sortByProcessingTime(possibleResults),
    })
    console.log('returning DB result')
    return;
  } else {
    console.log('Request not in DB. Calling Services')
    next()
  }
  return;
}