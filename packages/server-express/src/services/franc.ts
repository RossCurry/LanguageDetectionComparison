import {franc, francAll, Options} from 'franc'
import { TranslationResult } from './deepl.js';

export default function detectFranc(text:string, completeResults: boolean = false): TranslationResult {
  const francOptions: Options = {
    minLength: 2 // default is 10, to much for short words
  }
  // const fnCall = completeResults ? francAll : franc
  // const result = fnCall(text, francOptions);
  const result = franc(text, francOptions);
  console.log('detectFranc analyse', result)
  return {
    confidence: null,
    detectedLang: result,
    originalText: text
  }
}