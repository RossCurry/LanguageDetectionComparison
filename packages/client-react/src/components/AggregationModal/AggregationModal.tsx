import React, { useEffect, useState } from 'react'
import { useReactTable, TableOptions, ColumnDef, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table'
import style from './AggregationModal.module.css'
import { AggregateQuery, AggregateResult } from '../../../../shared-utils/Types'


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
    <div className={style.aggregationModalContainer}>AggregationModal
      {/* Add a cool table */}
      {AggregateQuery 
        ? <TanTableReact aggregateResults={AggregateQuery.aggregateResults} />
        : null
      }
    </div>
  )
}

type TableHeaders = '_id'| 'avgProcessingTimeMs' | 'avgMatchesDeepL'
type TableData = Pick<AggregateResult, TableHeaders>
type TableProps = {
  aggregateResults: AggregateQuery["aggregateResults"]
}
function TanTableReact({ aggregateResults } : TableProps) {
  const tableData = aggregateResults;
  const columnHelper = createColumnHelper<TableData>()
  const columns = [
    // Accessor Column - more advanced
    columnHelper.accessor(row => row._id, {
      id: 'serviceName',
      cell: info => info.getValue(),
      header: () => <span>Service</span>,
    }),
    columnHelper.accessor(row => row.avgMatchesDeepL, {
      id: 'avgMatchesDeepL',
      cell: info => info.getValue() + '%',
      header: () => <span>Accuracy</span>,
    }),
    columnHelper.accessor(row => row.avgProcessingTimeMs, {
      id: 'avgProcessingTimeMs',
      cell: info => info.getValue().toFixed(4),
      header: () => <span>Avg processing time (ms)</span>,
    }),
    // basic col header
    // columnHelper.accessor('avgMatchesDeepL', {
    //   cell: info => info.getValue() + '%',
    // }),
    
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className={style.tableContainer}>
            <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}