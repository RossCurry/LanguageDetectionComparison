import React, { useEffect, useState } from 'react'
import style from './AggregationModal.module.css'
import { AggregateQuery } from '../../../../shared-utils/Types'


export default function AggregationModal() {
  const [aggregationResults, setAggregationResults] = useState<AggregateQuery | null>(null)
  
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
      setAggregationResults(asJson);
      console.log(asJson);
      // asJson.forEach((result) => {
      //   console.table(result);
      // });
    }
    getAggregationResults()
  }, [])
  return (
    <div className={style.aggregationModalContainer}>AggregationModal
      {/* Add a cool table */}
      {aggregationResults && <div>got some results</div>}
    </div>
  )
}
