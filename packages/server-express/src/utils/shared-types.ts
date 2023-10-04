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