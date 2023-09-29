import LID from 'fasttext-lid';
const lid = new LID();
export default async function detectFasttext(text) {
    const result = await lid.predict(text);
    console.log('detectFasttext analyse', result);
    if (!Array.isArray(result) || !result.length)
        throw new Error('Fasttext service returned no resuls');
    const [detectedResult] = result;
    return {
        confidence: detectedResult.prob,
        detectedLang: detectedResult.lang,
        originalText: text
    };
}
