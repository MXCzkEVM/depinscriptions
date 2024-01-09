import { MenuItem } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CancelButton, ExplorerButton, Select, Switch } from './components'

import { useColumnsByOrders } from './hooks'
import { Condition, DataTable, Icon, Refresh } from '@/components'
import { useEventBus, useGridPaginationFields, useRouterQuery, useServerPagination, useWatch } from '@/hooks'
import { getOrder } from '@/api'
import { Order } from '@/api/index.type'

function MyOrder() {
  const tick = useRouterQuery('token')
  const { t } = useTranslation()

  const [denominated, setDenominated] = useState(false)
  const [allMarkets, setAllMarkets] = useState(false)
  const [status, setStatus] = useState<any[]>([0, 1, 2])

  const columns = useColumnsByOrders({
    hideExplorerIcon: true,
    hideHexagon: true,
    denominated,
    extendRows: [{
      renderCell: params => renderColumnByAction(params.row),
      field: 'action',
      headerName: t('Action'),
      minWidth: 120,
      flex: 1,
    }],
  })

  const [state, controls] = useServerPagination({
    resolve: model => getOrder({
      ...model,
      tick: allMarkets ? '' : tick,
      status,
    }),
    limit: 10,
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  function renderColumnByAction(row: Order) {
    if (row.status === 3)
      return '-'
    return (
      <div className="w-full flex justify-between">
        <div className="flex-1">
          <Condition is={row.status === 0}>
            <CancelButton data={row} onCancelled={controls.reload} />
          </Condition>
        </div>
        <ExplorerButton row={row} />
      </div>
    )
  }

  useWatch([tick, allMarkets, status], () => {
    tick && controls.reload()
  })
  useEventBus('reload:page').on(controls.reload)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6 mb-5 text-sm sm:text-base">
        <div className="flex items-center">
          <Switch label={t('USD Denominated')} checked={denominated} onChange={setDenominated} />
          <Switch label={t('All Markets')} checked={allMarkets} onChange={setAllMarkets} />
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

export default MyOrder
