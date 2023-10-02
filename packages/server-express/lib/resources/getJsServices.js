import translateDeepl from '../services/deepl.js';
import detectChardet from '../services/chardet.js';
import detectFasttext from '../services/fasttext-lid.js';
import detectFranc from '../services/franc.js';
import { insertOneQueryResult } from '../db/addResult.js';
export async function callJavascriptServices(text) {
    const services = [
        { name: 'chardet', fn: detectChardet },
        { name: 'fasttext', fn: detectFasttext },
        { name: 'franc', fn: detectFranc },
        { name: 'deepl', fn: translateDeepl },
    ];
    const results = {
        chardet: null,
        deepl: null,
        fasttext: null,
        franc: null,
    };
    await Promise.all(services.map(async (service) => {
        const detection = await service.fn(text);
        results[service.name] = detection;
    }));
    return results;
}
/**
 * send text in req to all services
 * return results to FE for comparison
 */
export default async (req, res, _next) => {
    const text = req.query.text;
    if (!text || typeof text !== "string")
        throw new Error('Missing text query from params');
    if (!req.body)
        console.warn('No req.body from python-server. Missing python services');
    // TODO missing assertion on body
    const pythonServices = req.body;
    const jsServices = await callJavascriptServices(text);
    const noNullValues = Object.values(jsServices).every(result => result !== null);
    if (noNullValues) {
        res.status(200);
    }
    else {
        res.status(500);
    }
    const allServices = { ...pythonServices, ...jsServices };
    // addMatches deepL for DB & FE
    const deeplDetectedLang = allServices["deepl"]?.detectedLang;
    for (const [name, result] of Object.entries(allServices)) {
        const matchesDeepL = result?.detectedLang === deeplDetectedLang;
        if (result)
            result.matchesDeepL = matchesDeepL;
        console.log('result', result);
    }
    // Send results to a DB
    await insertOneQueryResult(text, allServices);
    res.send({
        servicesSorted: Object.entries(allServices).sort((a, b) => {
            const [aName, aResults] = a;
            const [bName, bResults] = b;
            return (aResults?.processingTimeMs) - (bResults?.processingTimeMs);
        }),
        // TODO seems like this doesn't always work
        failedServices: Object.entries(allServices).reduce((failedService, service) => {
            const [name, serviceResults] = service;
            const deepLDetection = allServices["deepl"]?.detectedLang;
            if (serviceResults?.detectedLang !== deepLDetection)
                failedService.push(name);
            return failedService;
        }, [])
    });
};
