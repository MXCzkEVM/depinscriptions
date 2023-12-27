import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import LinearProgressWithLabel from './LinearProgressWithLabel'
import Condition from './Condition'
import Empty from './Empty'
import ChainLink from './ChainLink'
import { HolderDto, TickDto } from '@/api/index.type'
import { getHolder } from '@/api'
import { percentage, thousandBitSeparator } from '@/utils'
import { useMittOn } from '@/hooks/useMittOn'
import { useGridPaginationFields, useServerPagination } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

interface DataTableHoldersProps {
  token?: TickDto
}

function DataTableHolders(props: DataTableHoldersProps) {
  const { t } = useTranslation()

  const [state, controls] = useServerPagination({
    resolve: async (model) => {
      const response = await getHolder({
        tick: props.token?.tick,
        order: 'value',
        page: model.page,
        limit: model.limit,
      })
      return {
        data: response.data.map((item, index) => ({ ...item, index })),
        total: response.total,
      }
    },
  })

  const columns: GridColDef<HolderDto & { index: number }>[] = [
    {
      field: 'rank',
      headerName: t('Rank'),
      minWidth: 120,
      renderCell(params) {
        return (params.row.index + 1) + ((state.pagination.page - 1) * state.pagination.limit)
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

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  useMittOn('reload:table', controls.reload)
  useWhenever(props.token, controls.reload)

  return (
    <Condition is={props.token && state.value.length} else={<Empty loading={!props.token || state.loading} />}>
      <DataGrid
        className="border-none data-grid-with-row-pointer"
        {...gridPaginationFields}
        loading={state.loading || !props.token}
        getRowId={row => row.index}
        rows={state.value}
        columns={columns}
      />
    </Condition>
  )
}

export default DataTableHolders
