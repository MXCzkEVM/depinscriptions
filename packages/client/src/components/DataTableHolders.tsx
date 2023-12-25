import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useTranslation } from 'react-i18next'
import LinearProgressWithLabel from './LinearProgressWithLabel'
import Condition from './Condition'
import Empty from './Empty'
import ChainLink from './ChainLink'
import { HolderDto, TickDto } from '@/api/index.type'
import { getHolder } from '@/api'
import { percentage, thousandBitSeparator } from '@/utils'
import { useMittOn } from '@/hooks/useMittOn'

interface DataTableHoldersProps {
  token?: TickDto
}

function DataTableHolders(props: DataTableHoldersProps) {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [holders, setHolders] = useState<HolderDto[]>([])
  const { t } = useTranslation()

  const [state, fetch] = useAsyncFn(async (page: number) => {
    if (!props.token)
      return
    const { data, total } = await getHolder({
      order: 'value',
      tick: props.token.tick,
      page,
      limit: 15,
    })
    setPage(page)
    setHolders(data)
    setTotal(total)
  }, [props.token])

  const columns: GridColDef<HolderDto>[] = [
    {
      field: 'rank',
      headerName: t('Rank'),
      minWidth: 120,
      renderCell(params) {
        return (params.tabIndex + 2) * page
      },
    },
    {
      field: 'owner',
      headerName: t('Address'),
      minWidth: 180,
      flex: 1,
      renderCell(params) {
        return (
          <ChainLink type="address" href={params.row.owner}>
            {params.row.owner}
          </ChainLink>
        )
      },
    },
    {
      field: 'percentage',
      headerName: t('Percentage'),
      minWidth: 180,
      flex: 1,
      renderCell(params) {
        return (
          <div className="w-full mr-6">
            <LinearProgressWithLabel value={percentage(props.token?.total || 0, params.row.value)} />
          </div>
        )
      },
    },
    {
      field: 'value',
      headerName: t('Value'),
      minWidth: 150,
      renderCell(params) {
        return thousandBitSeparator(params.row.value)
      },
    },
  ]

  useMittOn('reload:table', () => fetch(1))

  useEffect(() => {
    fetch(page)
  }, [props.token])

  return (
    <Condition is={props.token && holders.length} else={<Empty loading={!props.token || state.loading} />}>
      <DataGrid
        className="border-none data-grid-with-row-pointer"
        hideFooterSelectedRowCount
        paginationMode="server"
        loading={state.loading || !props.token}
        getRowId={row => row.id}
        rowCount={Math.floor(total / 15)}
        paginationModel={{ page, pageSize: 15 }}
        onPaginationModelChange={model => fetch(model.page)}
        columns={columns}
        rows={holders}
      />
    </Condition>
  )
}

export default DataTableHolders
