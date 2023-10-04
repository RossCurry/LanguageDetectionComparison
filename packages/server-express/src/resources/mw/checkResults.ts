import { Request, Response, NextFunction } from 'express';
import { findOneQueryResult } from '../../db/findQuery.js';

export default async function checkResults(req: Request, res: Response, next: NextFunction) {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  // Check DB for matching Query first
  const possibleResults = await findOneQueryResult(text)
  if (possibleResults) {
    res.send({
      servicesSorted: Object.entries(possibleResults).sort((a, b) => {
        const [aName, aResults] = a;
        const [bName, bResults] = b;
        return (aResults?.processingTimeMs)! - (bResults?.processingTimeMs)!;
      }),
      failedServices: Object.entries(possibleResults).reduce((failedService, service) => {
        const [name, serviceResults] = service;
        if (!serviceResults?.matchesDeepL) failedService.push(name);
        return failedService;
      }, [] as string[])
    })
    console.log('returning DB result')
    return;
  } else {
    console.log('Calling services')
    next()
  }
  return;
}