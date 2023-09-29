import LID from 'fasttext-lid';
import { parseHrTime } from './deepl.js';
const lid = new LID();
export default async function detectFasttext(text) {
    // TODO add try/catch
    const startTime = process.hrtime();
    const result = await lid.predict(text);
    const timeDiff = process.hrtime(startTime);
    console.log('detectFasttext analyse', result);
    if (!Array.isArray(result) || !result.length)
        throw new Error('Fasttext service returned no resuls');
    const [detectedResult] = result;
    return {
        confidence: detectedResult.prob,
        detectedLang: detectedResult.lang,
        originalText: text,
        processingTime: parseHrTime(timeDiff)
    };
}
