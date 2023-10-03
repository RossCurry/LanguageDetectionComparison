import { useState } from 'react'
import './App.css'
import SearchInput from './components/SearchInput/SearchInput';
import ServiceResultCard from './components/ServiceResultCard/ServiceResultCard';
import AggregationModal from './components/AggregationModal/AggregationModal';

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
  
  const deeplResults = detectionResults?.servicesSorted.filter( ([serviceName]) => serviceName === "deepl")
  const otherResults = detectionResults?.servicesSorted.filter( ([serviceName]) => serviceName !== "deepl")

  return (
    <>
      <h1>Language detection</h1>
      <h3>Package comparison</h3>
      <SearchInput  setDetectionResults={setDetectionResults} />
      {/* Deelp Should always be on top */}
      {deeplResults 
        ? deeplResults.map(([serviceName,serviceResults], i) => {
          return (
            <ServiceResultCard 
              key={serviceName+i} 
              serviceResult={serviceResults} 
              serviceName={serviceName}
              matchesDeepl={true}
            />
          )})
        : null }
      {otherResults ? otherResults.map( ([serviceName, serviceResults], i) => {
        const matchesDeepl = deeplResults?.length ? deeplResults[0][1].detectedLang === serviceResults.detectedLang : false
        return (
          <ServiceResultCard 
          key={serviceName+i} 
          serviceResult={serviceResults} 
          serviceName={serviceName} 
          // matchesDeepl={!detectionResults?.failedServices.includes(serviceName)} // not correct
          matchesDeepl={matchesDeepl} 
          />
        )
      }) : null }
      <AggregationModal />
    </>
  )
}

export default App

