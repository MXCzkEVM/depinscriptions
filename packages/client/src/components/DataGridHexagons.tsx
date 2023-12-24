import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useAsyncFn } from 'react-use'
import LinearProgressWithLabel from './LinearProgressWithLabel'
import LocationForHexagon from './LocationForHexagon'
import { percentage } from '@/utils'
import { HexagonDto, TickDto } from '@/api/index.type'
import { getHexagon } from '@/api'

interface DataGridHexagonsProps {
  token?: TickDto
}

function DataGridHexagons(props: DataGridHexagonsProps) {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hexagons, setHexagons] = useState<HexagonDto[]>([])

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
  })

  const columns: GridColDef<HexagonDto>[] = [
    {
      field: 'hex',
      headerName: 'Location',
      minWidth: 120,
      renderCell(params) {
        return <LocationForHexagon hexagon={params.row.hex} />
      },
    },
    {
      field: 'percentage',
      headerName: 'Percentage',
      flex: 1,
      renderCell(params) {
        return <LinearProgressWithLabel value={percentage(props.token?.total || 0, params.row.mit)} />
      },
    },
  ]

  useEffect(() => {
    fetch(page)
  }, [page, props.token])

  return (
    <DataGrid
      className="border-none data-grid-with-row-pointer"
      paginationMode="server"
      hideFooterSelectedRowCount
      loading={state.loading || !props.token}
      getRowId={row => row.hex}
      rowCount={Math.floor(total / 15)}
      paginationModel={{ page, pageSize: 15 }}
      onPaginationModelChange={model => setPage(model.page)}
      columns={columns}
      rows={hexagons}
    />
  )
}

export default DataGridHexagons
