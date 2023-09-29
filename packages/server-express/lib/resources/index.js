import express from 'express';
import bodyParser from 'body-parser';
import detectChardet from '../services/chardet.js';
import detectFasttext from '../services/fasttext-lid.js';
import detectFranc from '../services/franc.js';
import translateDeepl from '../services/deepl.js';
export const router = express.Router();
router.use(bodyParser.json());
// router.use("/", (req: Request, res: Response, next: NextFunction) => {
//   console.log('Route hit', req.params)
//   next()
// })
router.post('/detect', async (req, res, _next) => {
    /**
     * send text in req to all services
     * return results to FE for comparison
     *
     */
    const text = req.query.text;
    if (!text || typeof text !== "string")
        throw new Error('Missing text query from params');
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
    for (const service of services) {
        const detection = await service.fn(text);
        results[service.name] = detection;
    }
    const noNullValues = Object.values(results).every(result => result !== null);
    if (noNullValues) {
        res.status(200);
    }
    else {
        res.status(500);
    }
    res.send({
        ...results,
        failedMatches: {
            failedService: Object.entries(results).reduce((failedService, service) => {
                const [name, serviceResults] = service;
                const deepLDetection = results["deepl"]?.detectedLang;
                if (serviceResults?.detectedLang !== deepLDetection)
                    failedService.push(name);
                return failedService;
            }, [])
        }
    });
});
