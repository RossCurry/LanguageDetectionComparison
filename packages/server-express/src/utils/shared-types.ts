import { iso6393To1 } from "./iso-639-3-to-1.js";

export type DetectionServices = 
  'langid' |
  'langdetect' |
  'chardet' |
  'franc' |
  'fasttext' |
  'deepl';

export type AggregateResult = { 
  _id: DetectionServices;
  trueCount: number;
  falseCount: number;
  avgProcessingTimeMs: number;
  avgMatchesDeepL?: number;
}

export type AggregateQuery = {
  totalDocuments: number,
  aggregateResults: AggregateResult[]
}

export type TestData = Array<{
  "iso-639-1": SourceLanguages;
  langCode: SourceLanguages;
  language: string;
  phrases: string[];
}>

export type SourceLanguages = typeof iso6393To1[keyof typeof iso6393To1] | ''

export type TranslationResult = {
  originalText: string;
  detectedLang: string;
  confidence: number | null;
  processingTimeMs: number;
  language: 'typescript' | 'javascript';
  matchesDeepL?: boolean;
  translatedText?: string;
  sourceLang?: SourceLanguages
}

export type PythonServiceResults = Record<'langid' | 'langdetect', TranslationResult>

export type ServicesResponse =  {
  chardet: TranslationResult | null;
  fasttext: TranslationResult | null;
  franc: TranslationResult | null;
  deepl: TranslationResult | null;
  langid: TranslationResult | null;
  langdetect: TranslationResult | null;
  socialhub: TranslationResult | null;
}

export type DocModel = {
  searchPhrase: string;
  wordCount: number;
  characterCount: number;
  serviceResults: ServicesResponse,
  sourceLang: SourceLanguages | undefined
}