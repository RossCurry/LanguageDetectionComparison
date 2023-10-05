import { useState } from 'react';
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender, getSortedRowModel } from '@tanstack/react-table';
import style from './TanTableReact.module.css';
import { AggregateQuery, AggregateResult } from '../../utils/shared-types';


const logos = {
  'deepl': 'https://cdn.worldvectorlogo.com/logos/deepl-1.svg',
  'langdetect': 'https://cdn.worldvectorlogo.com/logos/python-5.svg',
  'langid': 'https://cdn.worldvectorlogo.com/logos/python-5.svg',
  'fasttext': 'https://cdn.worldvectorlogo.com/logos/logo-javascript.svg',
  'chardet': 'https://cdn.worldvectorlogo.com/logos/typescript.svg',
  'franc': 'https://cdn.worldvectorlogo.com/logos/typescript.svg',
  'socialhub': 'https://cdn.worldvectorlogo.com/logos/typescript.svg',
};

type TableHeaders = '_id' | 'avgProcessingTimeMs' | 'avgMatchesDeepL';
type TableData = Pick<AggregateResult, TableHeaders>;
type TableProps = {
  aggregateResults: AggregateQuery["aggregateResults"];
};
export function TanTableReact({ aggregateResults }: TableProps) {
  const [sorting, setSorting] = useState<any>();
  const tableData = aggregateResults;
  const columnHelper = createColumnHelper<TableData>();
  const columns = [
    // Accessor Column - more advanced
    columnHelper.accessor(row => row._id, {
      id: 'serviceName',
      cell: info => (
        <div className={style.serviceName}>
          <img src={logos[info.getValue() as keyof typeof logos]} alt="Service or Programming language name" className={style.logo} />
          {info.getValue()}
        </div>
      ),
      header: () => <span>Service</span>,
    }),
    columnHelper.accessor(row => row.avgMatchesDeepL, {
      id: 'avgMatchesDeepL',
      cell: info => info.getValue()?.toFixed(0) + '%',
      header: () => <span>Accuracy</span>,
    }),
    columnHelper.accessor(row => row.avgProcessingTimeMs, {
      id: 'avgProcessingTimeMs',
      cell: info => info.getValue().toFixed(4),
      header: () => <span>Avg time (ms)</span>,
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });


  return (
    <div className={style.tableContainer}>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                console.log('header.column.getIsSorted()', header.column.getIsSorted());
                return (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        <span className={style.sortIcon}>
                          {{
                            asc: ' ⬆ asc',
                            desc: ' ⬇ desc',
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                    )}
                  </th>
                );
              })}
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
  );
}
