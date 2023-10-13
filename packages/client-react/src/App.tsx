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
  servicesSorted: readonly [string, TranslationResult][]
}

function App() {
  
  const [detectionResults, setDetectionResults] = useState<ApiDetectionResults | null>(null)
  const [showAggregationTable, setShowAggregationTable] = useState<boolean>(true)
  
  useEffect(() => {
    if (!detectionResults) return
    setShowAggregationTable(false)
  }, [detectionResults])

  return (
    <>
      <h1>Language detection</h1>
      <h3>Package comparison</h3>
        <SearchInput  
          setDetectionResults={setDetectionResults}  
          setShowAggregationTable={setShowAggregationTable} 
        />
      {
        showAggregationTable 
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

