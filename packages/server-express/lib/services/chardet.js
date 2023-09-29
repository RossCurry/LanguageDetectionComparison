import chardet from 'chardet';
import { Buffer } from 'node:buffer';
export default function detectChardet(text) {
    // const encoding = chardet.detect(Buffer.from('hello there!'));
    const analyse = chardet.analyse(Buffer.from(text));
    console.log('detectChardet analyse', analyse);
    if (!Array.isArray(analyse) || !analyse.length || analyse.length < 2)
        throw new Error('Chardet service returned no results');
    const highestScoredDetection = analyse[1]; // first element is encoding, second is highest scored result
    return {
        confidence: highestScoredDetection.confidence / 100,
        detectedLang: highestScoredDetection.lang || "",
        originalText: text
    };
}
