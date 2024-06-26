import { Card, CardContent, Pagination, TablePagination } from '@mui/material'
import { DataGrid, DataGridProps, GridColDef, GridValidRowModel } from '@mui/x-data-grid'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useWindowSize } from 'react-use'
import { Condition, Empty } from '../utils'

export type DataTableColDef<R extends GridValidRowModel> = GridColDef<R> & {
  hiddenHeaderName?: boolean
  hidden?: (row: R) => boolean
}

interface DataTableExtends<R extends GridValidRowModel> {
  toolbar?: ReactNode
  toolbarClass?: string
  contentClass?: string
  tableClass?: string
  columns: readonly DataTableColDef<R>[]
}

export type DataTableProps<T extends GridValidRowModel = any> =
  Omit<DataGridProps<T>, 'columns'> &
  DataTableExtends<T> &
  React.RefAttributes<HTMLDivElement>

export function DataTable<T extends GridValidRowModel>(props: DataTableProps<T>) {
  function renderPagination() {
    const pageSize = props.paginationModel?.pageSize || 0
    const page = props.paginationModel?.page || 0
    const rowCount = props.rowCount || 0
    // const currentCount = ((page - 1) * rowCount) + 1

    return (
      <div className="flex items-center justify-center md:justify-end mt-4">
        {/* <span className="hidden md:block mr-6">
          {(currentCount === -1 ? 0 : currentCount)}
          -
          {currentCount + props.rows.length}
          {' '}
          of
          {' '}
          {rowCount}
        </span> */}
        <Pagination
          disabled={props.loading}
          className="table-pagination-with-hidden-select"
          count={Math.ceil(rowCount / pageSize)}
          page={page + 1}
          onChange={(event, page) => {
            props.onPaginationModelChange?.({ page: page - 1, pageSize }, {})
          }}
        />
      </div>
    )
  }

  function renderSmallRow(row: T) {
    function renderCol(col: DataTableColDef<T>, index: number) {
      if (col.hidden?.(row) === true)
        return null
      return (
        <div className="text-[15px] flex flex-col" key={index}>
          <Condition is={col.hiddenHeaderName !== true}>
            <div className="text-[#bbbbbb] mb-[6px]">{col.headerName}</div>
          </Condition>
          <div className="text-xs flex-1 flex items-center">{col.renderCell?.({ row } as any)}</div>
        </div>
      )
    }
    return (
      <div
        className="grid grid-cols-3 gap-2 p-4 rounded-md bg-[rgb(48,52,61)]"
        key={props.getRowId?.(row)}
        onClick={() => props.onRowClick?.(
          { row } as any,
          {} as any,
          {} as any,
        )}
      >
        {props.columns.map(renderCol).filter(Boolean)}
      </div>
    )
  }

  const { width } = useWindowSize()

  return (
    <div className="data-table">
      <Card className="hidden md:block" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className={props.contentClass}>
          <div className={classNames(['mb-4', props.toolbarClass])}>
            {props.toolbar}
          </div>
          <Condition is={props.rows.length && width > 768} else={<Empty loading={props.loading} />}>
            <DataGrid
              className={classNames(['border-none data-grid-with-row-pointer data-grid-with-hidden-footer', props.tableClass])}
              hideFooterPagination
              {...props}
            />
            {renderPagination()}
          </Condition>
        </CardContent>
      </Card>
      <div className="block md:hidden">
        <div className={classNames(['mb-4', props.toolbarClass])}>
          {props.toolbar}
        </div>
        <Condition is={props.rows.length} else={<Empty loading={props.loading} />}>
          <div className={classNames(['flex flex-col gap-3', props.tableClass])}>
            {props.rows.map(row => renderSmallRow(row))}
          </div>
          {renderPagination()}
        </Condition>
      </div>
    </div>
  )
}
