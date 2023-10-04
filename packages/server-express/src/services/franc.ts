import {franc, francAll, Options} from 'franc'
import { parseHrTime } from './deepl.js';
import parseIso3to1 from 'iso-639-3-to-1';
import { TranslationResult } from '../utils/shared-types.js';

export default function detectFranc(text:string, completeResults: boolean = false): TranslationResult {
  const francOptions: Options = {
    minLength: 2 // default is 10, to much for short words
  }
  // const fnCall = completeResults ? francAll : franc
  // const result = fnCall(text, francOptions);
  const startTime = process.hrtime()
  const result = franc(text, francOptions);
  const timeDiff = process.hrtime(startTime)
  return {
    confidence: null,
    detectedLang: parseIso3to1(result),
    originalText: text,
    processingTimeMs: parseHrTime(timeDiff),
    language: 'typescript'
  }
}