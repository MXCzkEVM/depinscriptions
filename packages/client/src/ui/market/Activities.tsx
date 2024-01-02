import { Card, CardContent, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch } from '@mui/material'
import { useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { Refresh } from '@/components'
import { useGridPaginationFields, useServerPagination } from '@/hooks'
import { getToken } from '@/api'

export interface ActivitiesProps {

}

function Activities() {
  const [denominated, changeDenominated] = useState(false)
  const [event, setEvents] = useState<any[]>([])
  const { t } = useTranslation()

  const columns: GridColDef<any>[] = [
    {
      field: 'index',
      headerName: 'No.',
      minWidth: 90,
      flex: 1,
      renderCell() {
        return '#587187'
      },
    },
    {
      field: 'event',
      headerName: t('Event'),
      flex: 1,
    },
    {
      field: 'price',
      headerName: t('Price'),
    },
    {
      field: 'amount',
      headerName: t('Amount'),
    },
    {
      field: 'total',
      headerClassName: t('Total'),
    },
    {
      field: 'From',
      headerClassName: t('From'),
    },
    {
      field: 'To',
      headerClassName: t('To'),
    },
    {
      field: 'Time',
      headerClassName: t('Time'),
    },
  ]

  const [state, controls] = useServerPagination({
    resolve: model => getToken({ ...model, keyword: '', type: 1 }),
    limit: 10,
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex gap-2 items-center">
          <FormControlLabel
            control={
              <Switch checked={denominated} onChange={(_, value) => changeDenominated(value)} />
            }
            label="USD Denominated"
          />
          <Refresh hideText />
        </div>
        <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Event</InputLabel>
          <Select
            multiple
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            placeholder="all"
            value={event}
            onChange={event => setEvents(event.target.value as any)}
            label="Event"
          >

            <MenuItem value={10}>Listed</MenuItem>
            <MenuItem value={20}>Cancelled</MenuItem>
            <MenuItem value={30}>Sold</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent>
          <DataGrid
            className="border-none data-grid-with-row-pointer"
            {...gridPaginationFields}
            loading={state.loading}
            getRowId={row => row.tick}
            rows={state.value}
            columns={columns}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Activities
