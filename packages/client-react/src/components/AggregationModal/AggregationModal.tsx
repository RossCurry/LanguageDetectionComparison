import { useEffect, useState } from 'react'
import style from './AggregationModal.module.css'
import { AggregateQuery } from '../../utils/shared-types';
import { TanTableReact } from '../TanReactTable/TanTableReact';
import Loader from '../Loader/Loader';


export default function AggregationModal() {
  const [AggregateQuery, setAggregateQuery] = useState<AggregateQuery | null>(null)
  
  useEffect(() => {
    const getAggregationResults = async () => {
      const expressBaseurl = import.meta.env.VITE_API_EXPRESS;
      const url = new URL(expressBaseurl);
      url.pathname = 'aggregate';
      let result;
      try {
        result = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json'
          }
        });
      } catch (error) {
        console.error(error);
      }
      const asJson: AggregateQuery = await result?.json();
      setAggregateQuery(asJson);
      console.table(asJson.aggregateResults);
    }
    getAggregationResults()
  }, [])
  return (
    <>
      {AggregateQuery 
        ? <div className={style.aggregationModalContainer}>
            <TanTableReact aggregateResults={AggregateQuery.aggregateResults} />
          </div>
        : <Loader loadingText={"Comparison Table"} />
      }
  </>
  )
}
