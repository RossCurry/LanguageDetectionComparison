import { Request, Response, NextFunction } from 'express';
import { insertOneQueryResult } from '../../db/addResult.js';
import { PythonServiceResults, ServicesResponse, SourceLanguages } from '../../utils/shared-types.js';
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
  const pythonServices: PythonServiceResults | null = req.body?.pyhtonResults;
  const jsServices = await callJavascriptServices(text);
  const allServices = !pythonServices ? jsServices : { ...pythonServices, ...jsServices };

  assertIsServiceResponse(allServices)
  const deeplDetectedLang = allServices["deepl"]?.detectedLang;
  for (const [name, result] of Object.entries(allServices)) {
    const matchesDeepL = result?.detectedLang === deeplDetectedLang;
    if (result) result.matchesDeepL = matchesDeepL;
    console.log('result', result);
  }
  // Send results to a DB
  await insertOneQueryResult(text, allServices);

  res.send({
    servicesSorted: Object.entries(allServices).sort((a, b) => {
      const [aName, aResults] = a;
      const [bName, bResults] = b;
      return (aResults?.processingTimeMs)! - (bResults?.processingTimeMs)!;
    }),
    // TODO seems like this doesn't always work
    failedServices: Object.entries(allServices).reduce((failedService, service) => {
      const [name, serviceResults] = service;
      const deepLDetection = allServices["deepl"]?.detectedLang;
      if (serviceResults?.detectedLang !== deepLDetection) failedService.push(name);
      return failedService;
    }, [] as string[])
  });
};

function assertIsServiceResponse(serverResponse: unknown): asserts serverResponse is ServicesResponse {
  if (typeof serverResponse !== 'object' || !serverResponse) throw new Error('Is not defined, null or not an object')
  const noNullValues = Object.values(serverResponse).every(result => result !== null);
  if (!noNullValues) throw new Error('One of the service responses is null')
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

