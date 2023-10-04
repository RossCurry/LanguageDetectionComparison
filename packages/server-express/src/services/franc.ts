import {franc, francAll, Options} from 'franc'
import { parseHrTime } from './deepl.js';
import parseIso3to1 from 'iso-639-3-to-1';
import { TranslationResult } from '../utils/shared-types.js';
import { iso6393To1 } from '../utils/iso-639-3-to-1.js';

export default function detectFranc(text:string, completeResults: boolean = false): TranslationResult {
  const francOptions: Options = {
    minLength: 2 // default is 10, to much for short words
  }
  // const fnCall = completeResults ? francAll : franc
  // const result = fnCall(text, francOptions);
  const startTime = process.hrtime()
  const resultIso639 = franc(text, francOptions);
  const timeDiff = process.hrtime(startTime)
  let iso639One: string | undefined;
  try {
    iso639One = parseIso3to1(resultIso639) 
  } catch (error) {
    console.warn('Error trying to parse ISO-639-1 codes using iso-639-3-to-1 library')
  } 

  if (!iso639One){
    iso639One = iso6393To1[resultIso639 as keyof typeof iso6393To1] || resultIso639
  }
  return {
    confidence: null,
    detectedLang: iso639One,
    originalText: text,
    processingTimeMs: parseHrTime(timeDiff),
    language: 'typescript'
  }
}