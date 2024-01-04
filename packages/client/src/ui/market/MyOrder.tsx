/* eslint-disable ts/no-use-before-define */
import { Button, Card, CardContent, FormControl, FormControlLabel, InputLabel, Link, MenuItem, Select, SelectChangeEvent, Switch } from '@mui/material'
import { useContext, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { ArrowRedoCircleOutline } from '@ricons/ionicons5'
import { useInjectHolder } from '@overlays/react'
import { useSnapshot } from 'valtio'
import MarketContext from './Context'
import CancelButton from './components/CancelButton'
import { ChainLink, Condition, CountryFlag, Empty, Icon, Price, Refresh } from '@/components'
import { useGridPaginationFields, useRouterQuery, useServerPagination } from '@/hooks'
import { getOrder, getToken } from '@/api'
import { useWhenever } from '@/hooks/useWhenever'
import { OrderDto } from '@/api/index.type'
import { BigNum } from '@/utils'
import WaitingIndexModal from '@/components/WaitingIndexModal'
import store from '@/store'

const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER!

function MyOrder() {
  const [denominated, changeDenominated] = useState(false)
  const [status, setStatus] = useState<any[]>([0, 1, 2])

  const { limit, mode } = useContext(MarketContext)
  const { t } = useTranslation()

  const tick = useRouterQuery('token')
  const config = useSnapshot(store.config)

  const symbol = denominated ? 'usd' : 'mxc'

  const columns: GridColDef<OrderDto>[] = [
    {
      field: 'number',
      headerName: 'No.',
      minWidth: 60,
      renderCell(params) {
        return `#${params.row.number}`
      },
    },
    {
      field: 'status',
      headerName: t('Event'),
      renderCell(params) {
        const mappings = {
          0: <span style={{ color: 'rgb(134,239,172)' }}>{t('Listing')}</span>,
          1: <span style={{ color: 'rgb(252,165,165)' }}>{t('Sold')}</span>,
          2: <span style={{ color: 'rgb(100,116,139)' }}>{t('Cancelled')}</span>,
          3: <span style={{ color: 'rgb(100,116,139)' }}>{t('Expired')}</span>,
        }
        return mappings[params.row.status]
      },
    },
    {
      field: 'tick',
      headerName: t('Token'),
      minWidth: 90,
      renderCell(params) {
        return <CountryFlag find={params.row.tick} />
      },
    },
    {
      field: 'price',
      headerName: t('Price'),
      renderCell(params) {
        const unitPrice = BigNum(params.row.price).div(params.row.amount)
        const limitPrice = BigNum(limit).multipliedBy(unitPrice)
        const mxcPrice = mode === 'mint' ? limitPrice : unitPrice
        const usdPrice = BigNum(mxcPrice).multipliedBy(config.price)
        return <Price symbol={symbol} value={denominated ? usdPrice : mxcPrice} />
      },
    },
    {
      field: 'amount',
      headerName: t('Amount'),
      renderCell(params) {
        return <Price value={params.row.amount} />
      },
    },
    {
      field: 'total',
      headerName: t('Total'),
      renderCell(params) {
        const mxcPrice = params.row.price
        const usdPrice = BigNum(mxcPrice).multipliedBy(config.price)
        return <Price symbol={symbol} value={denominated ? usdPrice : mxcPrice} />
      },
    },
    {
      field: 'maker',
      headerName: t('From'),
      minWidth: 140,
      flex: 1,
      renderCell(params) {
        const address = params.row.status === 1
          ? params.row.buyer
          : params.row.maker
        return <ChainLink type="address" href={address} />
      },
    },
    {
      field: 'buyer',
      headerName: t('To'),
      minWidth: 140,
      flex: 1,
      renderCell(params) {
        const address = params.row.status === 1
          ? params.row.maker
          : params.row.buyer
        if (!address)
          return '-'
        return <ChainLink type="address" href={address} />
      },
    },
    {
      field: 'time',
      headerName: t('Time'),
      minWidth: 140,
      flex: 1,
      renderCell(params) {
        return dayjs(params.row.lastTime).format('MM-DD HH:mm:ss')
      },
    },
    {
      field: 'action',
      headerName: t('Action'),
      minWidth: 140,
      flex: 1,
      renderCell(params) {
        if (params.row.status === 3)
          return '-'
        return (
          <div className="w-full flex justify-between">
            <div className="flex-1">
              <Condition is={params.row.status === 0}>
                <CancelButton data={params.row} onCancelled={controls.reload} />
              </Condition>
            </div>
            <Link color="inherit" target="_blank" href={`${EXPLORER_URL}/tx/${params.row.hash}`}>
              <Icon className="cursor-pointer">
                <ArrowRedoCircleOutline />
              </Icon>
            </Link>
          </div>
        )
      },
    },
  ]

  const [state, controls] = useServerPagination({
    resolve: model => getOrder({ ...model, status, tick }),
    limit: 10,
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  useWhenever(tick, controls.reload)
  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex gap-2 items-center">
          <FormControlLabel
            control={
              <Switch checked={denominated} onChange={(_, value) => changeDenominated(value)} />
            }
            label={t('USD Denominated')}
          />
          <Refresh onClick={controls.reload} hideText />
        </div>
        <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Event</InputLabel>
          <Select
            multiple
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            placeholder="all"
            value={status}
            onChange={event => setStatus(event.target.value as any)}
            label="Event"
          >

            <MenuItem value={0}>Listed</MenuItem>
            <MenuItem value={2}>Cancelled</MenuItem>
            <MenuItem value={1}>Sold</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent>
          <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
            <DataGrid
              className="border-none"
              {...gridPaginationFields}
              loading={state.loading}
              getRowId={row => row.number}
              rows={state.value}
              columns={columns}
            />
          </Condition>
        </CardContent>
      </Card>
    </>
  )
}

export default MyOrder
