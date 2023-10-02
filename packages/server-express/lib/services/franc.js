import { franc } from 'franc';
import { parseHrTime } from './deepl.js';
export default function detectFranc(text, completeResults = false) {
    const francOptions = {
        minLength: 2 // default is 10, to much for short words
    };
    // const fnCall = completeResults ? francAll : franc
    // const result = fnCall(text, francOptions);
    const startTime = process.hrtime();
    const result = franc(text, francOptions);
    const timeDiff = process.hrtime(startTime);
    return {
        confidence: null,
        detectedLang: result,
        originalText: text,
        processingTimeMs: parseHrTime(timeDiff),
        language: 'typescript'
    };
}
