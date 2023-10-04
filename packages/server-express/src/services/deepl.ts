/* eslint-disable max-len */
import * as deepl from 'deepl-node';
// Configure env variables
import dotenv from 'dotenv'
import { TranslationResult } from '../utils/shared-types.js';
dotenv.config()



export function parseHrTime(timeDiff: [number, number]) {
  // https://nodejs.org/api/process.html#processhrtime
  const NS_PER_SEC = 1e9
  const nanoseconds = timeDiff[0] * NS_PER_SEC + timeDiff[1]
  const nanoAsMilli = 1_000_000
  const asMilliseconds = nanoseconds / nanoAsMilli
  return asMilliseconds
}


/**
 * Fetches translation from Deepl Translate
 *
 * @param {string} text - text to translate
 * @param {deepl.TargetLanguageCode} targetLanguage - language to translate to
 * @param {deepl.SourceLanguageCode} sourceLanguage - Optional source language to translate from
 */
export default async function translateDeepl(
  text: string,
  targetLanguage: deepl.TargetLanguageCode = 'de',
  sourceLanguage: deepl.SourceLanguageCode | null = null
): Promise<TranslationResult> {
  let translatedText: string;
  let detectedSourceLang: deepl.SourceLanguageCode;
  const translatorOptions: deepl.TranslatorOptions = { sendPlatformInfo: false };
  const deeplAuth = process.env.DEEPL_AUTH
  if (!deeplAuth) throw new Error("No auth token found for deepL")
  const translator = new deepl.Translator(deeplAuth, translatorOptions);
  let timeDiff;
  try {
    const startTime = process.hrtime()
    const result = await translator.translateText(text, sourceLanguage, targetLanguage);
    timeDiff = process.hrtime(startTime)
    translatedText = result.text;
    detectedSourceLang = result.detectedSourceLang;
  }
  catch (error) {
    console.error(error);
    throw new Error(`Somethign went wrong using the deepl translation client: ${(error as Error).message}`);
  }

  return {
    originalText: text,
    detectedLang: detectedSourceLang,
    confidence: null,
    processingTimeMs: parseHrTime(timeDiff),
    language: 'typescript',
    translatedText
  };
}
