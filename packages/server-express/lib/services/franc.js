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
    console.log('detectFranc analyse', result);
    return {
        confidence: null,
        detectedLang: result,
        originalText: text,
        processingTime: parseHrTime(timeDiff)
    };
}
