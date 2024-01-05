import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { LinearProgressWithLabel } from '../feedback'
import { Condition, Empty } from '../utils'
import { LocationForHexagon } from './LocationForHexagon'
import { ejectBlankPage, percentage } from '@/utils'
import { HexagonDto, TickDto } from '@/api/index.type'
import { getHexagon } from '@/api'
import { useEventBus, useGridPaginationFields, useServerPagination, useWhenever } from '@/hooks'

const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER!

export interface DataTableHexagonsProps {
  token?: TickDto
}

export function DataTableHexagons(props: DataTableHexagonsProps) {
  const { t } = useTranslation()

  const [state, controls] = useServerPagination({
    resolve: model => getHexagon({
      tick: props.token!.tick,
      page: model.page,
      limit: model.limit,
    }),
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  const columns: GridColDef<HexagonDto>[] = [
    {
      field: 'hex',
      headerName: t('Location'),
      minWidth: 280,
      renderCell(params) {
        return <LocationForHexagon hexagon={params.row.hex} />
      },
    },
    {
      field: 'percentage',
      headerName: t('Percentage'),
      flex: 1,
      renderCell(params) {
        return (
          <LinearProgressWithLabel
            className="w-full"
            value={percentage(props.token?.total || 0, params.row.mit)}
          />
        )
      },
    },
  ]

  useEventBus('reload:page').on(controls.reload)
  useWhenever(props.token, controls.reload)

  return (
    <Condition is={props.token && state.value.length} else={<Empty loading={!props.token || state.loading} />}>
      <DataGrid
        className="border-none data-grid-with-row-pointer"
        {...gridPaginationFields}
        loading={state.loading || !props.token}
        getRowId={row => row.hex}
        rows={state.value}
        columns={columns}
        onRowClick={() => ejectBlankPage(`${EXPLORER_URL}/mapper`)}
      />
    </Condition>
  )
}
