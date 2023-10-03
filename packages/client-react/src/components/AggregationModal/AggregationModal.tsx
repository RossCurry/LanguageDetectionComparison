import React, { useEffect, useState } from 'react'
import style from './AggregationModal.module.css'
import { AggregateQuery } from '../../utils/shared-types';
import { TanTableReact } from '../TanReactTable/TanTableReact';


export default function AggregationModal() {
  const [AggregateQuery, setAggregateQuery] = useState<AggregateQuery | null>(null)
  
  useEffect(() => {
    const getAggregationResults = async () => {
      const expressBaseurl = 'http://localhost:3000';
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
      // asJson.forEach((result) => {
      //   console.table(result);
      // });
    }
    getAggregationResults()
  }, [])
  return (
    <div className={style.aggregationModalContainer}>
      {/* Add a cool table */}
      {AggregateQuery 
        ? <TanTableReact aggregateResults={AggregateQuery.aggregateResults} />
        : <div className={style.loadingLoader}>loading...</div>
      }
    </div>
  )
}

