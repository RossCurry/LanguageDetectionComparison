import { franc } from 'franc';
export default function detectFranc(text, completeResults = false) {
    const francOptions = {
        minLength: 2 // default is 10, to much for short words
    };
    // const fnCall = completeResults ? francAll : franc
    // const result = fnCall(text, francOptions);
    const result = franc(text, francOptions);
    console.log('detectFranc analyse', result);
    return {
        confidence: null,
        detectedLang: result,
        originalText: text
    };
}
