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

export type TranslationResult = {
  originalText: string;
  detectedLang: string;
  confidence: number | null;
  processingTimeMs: number;
  language: 'typescript' | 'javascript';
  matchesDeepL?: boolean;
  translatedText?: string;
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
  serviceResults: ServicesResponse
}