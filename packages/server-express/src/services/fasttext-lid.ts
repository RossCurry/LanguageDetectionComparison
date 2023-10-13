import LID from 'fasttext-lid';
import { parseHrTime } from './deepl.js';
import { TranslationResult } from '../utils/shared-types.js';
import path from 'node:path';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const modelDir = path.resolve(__dirname, 'data-model')
const modelPath = path.resolve(modelDir, 'fasttext-model.bin')

const lid = new LID();
export default async function detectFasttext(text:string): Promise<TranslationResult> {
  let result;
  let timeDiff;
  try {
    const startTime = process.hrtime()
    result = await lid.predict(text);
    timeDiff = process.hrtime(startTime)
  } catch (error) {
    console.error('Error detecting fasttext', error);
    throw error;
  }
  if (!result || !Array.isArray(result) || !result.length) throw new Error('Fasttext service returned no resuls')
  const [detectedResult] = result
  return {
    confidence: detectedResult.prob,
    detectedLang: detectedResult.lang,
    originalText: text,
    processingTimeMs: parseHrTime(timeDiff),
    language: 'javascript'
  }
}

