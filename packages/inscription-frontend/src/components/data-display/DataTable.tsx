import { Card, CardContent } from '@mui/material'
import { DataGrid, DataGridProps, GridValidRowModel } from '@mui/x-data-grid'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { Condition, Empty } from '../utils'

export interface DataTableExtends {
  toolbar?: ReactNode
  toolbarClass?: string
  contentClass?: string
}

export type DataTableProps<T extends GridValidRowModel = any> =
  DataGridProps<T> &
  DataTableExtends &
  React.RefAttributes<HTMLDivElement>

export function DataTable<T extends GridValidRowModel>(props: DataTableProps<T>) {
  return (
    <div className="data-table">
      <Card className="hidden md:block" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className={props.contentClass}>
          <div className={classNames(['mb-4 flex justify-between items-center', props.toolbarClass])}>
            {props.toolbar}
          </div>
          <Condition is={props.rows.length} else={<Empty loading={props.loading} />}>
            <DataGrid
              {...props}
              hideFooterPagination
            />
          </Condition>
        </CardContent>
      </Card>
      <div className="block md:hidden">
        <div className={classNames(['mb-4 flex justify-between items-center', props.toolbarClass])}>
          {props.toolbar}
        </div>

      </div>
    </div>
  )
}
