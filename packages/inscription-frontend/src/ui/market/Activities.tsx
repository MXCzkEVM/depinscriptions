import { MenuItem } from '@mui/material'
import { useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { Select, Switch } from './components'
import { useColumnsByOrders } from './hooks'
import { DataTable, Refresh } from '@/components'
import { useEventBus, useGridPaginationFields, useRouterQuery, useServerPagination, useWatch } from '@/hooks'
import { getOrderRecord } from '@/api'
import { Order } from '@/api/index.type'

function Activities() {
  const [denominated, changeDenominated] = useState(false)
  const [status, setStatus] = useState<any[]>([0, 1, 2])

  const { t } = useTranslation()

  const tick = useRouterQuery('token')

  const columns: GridColDef<Order>[] = useColumnsByOrders({
    denominated,
  })

  const [state, controls] = useServerPagination({
    resolve: model => getOrderRecord({ ...model, status, tick }),
    limit: 10,
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })
  useWatch([tick, status], () => {
    tick && controls.reload()
  })
  useEventBus('reload:page').on(controls.reload)
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6 mb-5">
        <div className="flex items-center">
          <Switch label={t('USD Denominated')} checked={denominated} onChange={changeDenominated} />
          <Refresh onClick={controls.reload} hideText />
        </div>
        <Select value={status} onChange={setStatus} label={t('Event')}>
          <MenuItem value={0}>{t('Listed')}</MenuItem>
          <MenuItem value={2}>{t('Cancelled')}</MenuItem>
          <MenuItem value={1}>{t('Sold')}</MenuItem>
        </Select>
      </div>
      <DataTable
        className="border-none"
        {...gridPaginationFields}
        loading={state.loading}
        getRowId={row => row.number}
        rows={state.value}
        columns={columns}
      />
    </>
  )
}

export default Activities
