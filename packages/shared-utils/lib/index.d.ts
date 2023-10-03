export type DetectionServices = 'langid' | 'langdetect' | 'chardet' | 'franc' | 'fasttext' | 'deepl';
export type AggregateResult = {
    _id: DetectionServices;
    trueCount: number;
    falseCount: number;
    avgProcessingTimeMs: number;
    avgMatchesDeepL?: number;
};
export type AggregateQuery = {
    totalDocuments: number;
    aggregateResults: AggregateResult[];
};
