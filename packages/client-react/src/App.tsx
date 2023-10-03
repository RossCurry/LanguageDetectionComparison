import { useEffect, useState } from 'react'
import SearchInput from './components/SearchInput/SearchInput';
import AggregationModal from './components/AggregationModal/AggregationModal';
import { SearchResults } from './components/SearchResults/SearchResults';
import Loader from './components/Loader/Loader';
import style from './App.module.css'

export interface TranslationResult {
  originalText: string;
  detectedLang: string;
  confidence: number | null;
  processingTimeMs: number;
  language: 'typescript' | 'javascript'
}

export type ApiDetectionResults = {
  failedServices: string[],
  servicesSorted: readonly [string, TranslationResult][]
}

function App() {
  
  const [detectionResults, setDetectionResults] = useState<ApiDetectionResults | null>(null)
  const [showAggregation, setShowAggregation] = useState<boolean>(true)
  
  useEffect(() => {
    if (!detectionResults) return
    setShowAggregation(false)
  }, [detectionResults])

  return (
    <>
      <h1>Language detection</h1>
      <h3>Package comparison</h3>
        <SearchInput  setDetectionResults={setDetectionResults} setShowAggregation={setShowAggregation} buttonText={showAggregation ? 'detect' : 'show table'}/>
      {
        showAggregation 
        ? <AggregationModal />
        : detectionResults
          ?  <SearchResults  detectionResults={detectionResults}/>
          :  <Loader loadingText={"Query Results"} />
      }
      <div className={style.note}>* using deepL as the defect standard</div>
    </>
  )
}

export default App

