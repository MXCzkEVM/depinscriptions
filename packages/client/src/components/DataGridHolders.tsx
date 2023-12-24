import { getHolder } from "@/api"
import { HolderDto, TickDto } from "@/api/index.type"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useAsyncFn } from "react-use"
import LinearProgressWithLabel from "./LinearProgressWithLabel"
import { percentage, thousandBitSeparator } from "@/utils"

interface DataGridHoldersProps {
  token?: TickDto
}

function DataGridHolders(props: DataGridHoldersProps) {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [holders, setHolders] = useState<HolderDto[]>([])

  const [state, fetch] = useAsyncFn(async (page: number) => {
    if (!props.token)
      return
    const { data, total } = await getHolder({
      order: 'value',
      tick: props.token.tick,
      page,
      limit: 15
    })
    setHolders(data)
    setTotal(total)
  })

  const columns: GridColDef<HolderDto>[] = [
    {
      field: 'rank',
      headerName: 'Rank',
      minWidth: 120,
      renderCell(params) {
        return (params.tabIndex + 1) * page
      },
    },
    {
      field: 'owner',
      headerName: 'Address',
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'percentage',
      headerName: 'Percentage',
      flex: 1,
      renderCell(params) {
        return (
          <div className="w-[122px] mr-6">
            <LinearProgressWithLabel value={percentage(props.token?.total || 0, params.row.value)} />
          </div>
        )
      },
    },
    {
      field: 'value', headerName: 'Value', minWidth: 150,
      renderCell(params) {
          return thousandBitSeparator(params.row.value)
      },
    },
  ]

  useEffect(() => { fetch(page) }, [page, props.token])

  return <DataGrid
    className="border-none data-grid-with-row-pointer"
    hideFooterSelectedRowCount
    paginationMode="server"
    loading={state.loading || !props.token}
    getRowId={row => row.id}
    rowCount={Math.floor(total / 15)}
    paginationModel={{ page, pageSize: 15 }}
    onPaginationModelChange={(model) => setPage(model.page)}
    columns={columns}
    rows={holders}
  />
}

export default DataGridHolders