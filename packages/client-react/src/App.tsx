import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export interface TranslationResult {
  originalText: string;
  detectedLang: string;
  confidence: number | null;
  processingTimeMs: number;
  language: 'typescript' | 'javascript'
}

type ApiDetectionResults = {
  failedServices: string[],
  servicesSorted: readonly [string, TranslationResult][]
}

function App() {
  const [count, setCount] = useState(0)
  const [input, setInput] = useState('')
  const [detectionResults, setDetectionResults] = useState<ApiDetectionResults | null>()
  

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <form onSubmit={async (e) => {
        e.preventDefault()
        const expressBaseurl = 'http://localhost:3000'
        const url = new URL(expressBaseurl)
        url.pathname = 'detect'
        url.searchParams.set('text', input)
        let result;
        try {
          result = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            }
          })
        } catch (error) {
          console.error(error)
        }
        const asJson: ApiDetectionResults = await result?.json()
        setDetectionResults(asJson)
        console.log(asJson)
        asJson.servicesSorted.forEach(([serviceName, serviceResult]) => {
          console.log(serviceName)
          console.table(serviceResult)

        })
      }}>
        <input type="text" name="searchTerm" id="searchTerm" placeholder='Type search term to detect' value={input} onChange={(e) => setInput(e.target.value)}/>
        <button type="submit">detect</button>
      </form>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
