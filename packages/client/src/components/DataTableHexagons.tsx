import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useTranslation } from 'react-i18next'
import LinearProgressWithLabel from './LinearProgressWithLabel'
import LocationForHexagon from './LocationForHexagon'
import Condition from './Condition'
import Empty from './Empty'
import { percentage } from '@/utils'
import { HexagonDto, TickDto } from '@/api/index.type'
import { getHexagon } from '@/api'
import { useMittOn } from '@/hooks/useMittOn'

interface DataTableHexagonsProps {
  token?: TickDto
}

function DataTableHexagons(props: DataTableHexagonsProps) {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hexagons, setHexagons] = useState<HexagonDto[]>([])
  const { t } = useTranslation()

  const [state, fetch] = useAsyncFn(async (page: number) => {
    if (!props.token)
      return
    const { data, total } = await getHexagon({
      tick: props.token.tick,
      page,
      limit: 15,
    })
    setHexagons(data)
    setTotal(total)
    setPage(page)
  }, [props.token])

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
        return <LinearProgressWithLabel className="w-full" value={percentage(props.token?.total || 0, params.row.mit)} />
      },
    },
  ]

  useMittOn('reload:table', () => fetch(1))

  useEffect(() => {
    fetch(page)
  }, [props.token])

  return (
    <Condition is={props.token && hexagons.length} else={<Empty loading={!props.token || state.loading} />}>
      <DataGrid
        className="border-none data-grid-with-row-pointer"
        paginationMode="server"
        hideFooterSelectedRowCount
        loading={state.loading || !props.token}
        getRowId={row => row.hex}
        rowCount={Math.floor(total / 15)}
        paginationModel={{ page, pageSize: 15 }}
        onPaginationModelChange={model => fetch(model.page)}
        columns={columns}
        rows={hexagons}
      />
    </Condition>
  )
}

export default DataTableHexagons
