import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import LinearProgressWithLabel from './LinearProgressWithLabel'
import LocationForHexagon from './LocationForHexagon'
import Condition from './Condition'
import Empty from './Empty'
import { percentage } from '@/utils'
import { HexagonDto, TickDto } from '@/api/index.type'
import { getHexagon } from '@/api'
import { useMittOn } from '@/hooks/useMittOn'
import { useGridPaginationFields, useServerPagination } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

interface DataTableHexagonsProps {
  token?: TickDto
}

function DataTableHexagons(props: DataTableHexagonsProps) {
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
      minWidth: 240,
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

  useMittOn('reload:table', controls.reload)
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
      />
    </Condition>
  )
}

export default DataTableHexagons
