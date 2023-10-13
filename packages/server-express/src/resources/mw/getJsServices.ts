import { Request, Response, NextFunction } from 'express';
import { insertOneQueryResult } from '../../db/addResult.js';
import { PythonServiceResults, ServicesResponse, SourceLanguages, TranslationResult } from '../../utils/shared-types.js';
import { ServiceNames, ServiceValues, services } from '../../services/index.js';

/**
 * send text in req to all services
 * return results to FE for comparison
 */
export default async function getJsServices(req: Request, res: Response, _next: NextFunction) {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  if (!req.body.pyhtonResults) console.warn('No req.body from python-server. Missing python services');
  // TODO missing assertion on body
  const pythonServices: PythonServiceResults | null = req.body.pyhtonResults ? req.body?.pyhtonResults : null;
  const jsServices = await callJavascriptServices(text);
  const allServices = !pythonServices ? jsServices : { ...pythonServices, ...jsServices };

  // assert no null services
  assertIsServiceResponse(allServices)

  // mutate to include deepL match boolean
  includeDeeplMatch(allServices)
  
  // Send results to a DB
  await insertOneQueryResult(text, allServices);

  // Response with all results sorted.
  res.send({
    servicesSorted: sortByProcessingTime(allServices),
  });
};

function assertIsServiceResponse(serverResponse: unknown): asserts serverResponse is ServicesResponse {
  if (typeof serverResponse !== 'object' || !serverResponse) throw new Error('Is not defined, null or not an object')
  const keys: any[] = []
  const noNullValues = Object.entries(serverResponse).every(([key, result]) => {
    const isNull = result === undefined || result === null
    if (isNull) keys.push({ key, result })
    return result !== null
  });
  if (!noNullValues) throw new Error(`One of the service responses is null ${JSON.stringify(keys)}`)
}

export async function callJavascriptServices(text: string, sourceLang: SourceLanguages = '') {
  const results: Record<ServiceNames, ServiceValues | null> = {
    chardet: null,
    deepl: null,
    fasttext: null,
    franc: null,
    socialhub: null,
  }
  await Promise.all(services
    .filter(s => {
      // fasttext Refuses to work on PROD 'render'
      return process.env.PROD && s.name === 'fasttext' ? false : true
    })
    .map(async (service) => {
      console.log('Promise.all', service.name, !!service.fn)
      try {
        const detection = await service.fn(text)
        results[service.name] = { ...detection, sourceLang };
      } catch (error) {
        throw new Error(`Error throw by service: ${service.name}`)
      }
    }))
  return results
}

function includeDeeplMatch(allServices: ServicesResponse) {
  const deeplDetectedLang = allServices["deepl"]?.detectedLang;
  for (const [name, result] of Object.entries(allServices)) {
    if (!result) continue;
    const matchesDeepL = result?.detectedLang === deeplDetectedLang;
    result.matchesDeepL = matchesDeepL;
  }
}
export function sortByProcessingTime(allServices: ServicesResponse) {
  return Object.entries(allServices).sort((a, b) => {
    const [aName, aResults] = a;
    const [bName, bResults] = b;
    return (aResults?.processingTimeMs)! - (bResults?.processingTimeMs)!;
  })
}

