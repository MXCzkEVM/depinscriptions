import { GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useSnapshot } from 'valtio'
import Link from 'next/link'
import dayjs from 'dayjs'
import { ArrowRedoCircleOutline } from '@ricons/ionicons5'
import { GridBaseColDef } from '@mui/x-data-grid/internals'
import { useAccount } from 'wagmi'
import MarketContext from '../Context'
import { ExplorerButton } from '../components'
import { Order } from '@/api/index.type'
import { ChainLink, Condition, DataTableColDef, Flag, Icon, LocationForHexagon, Price } from '@/components'
import { BigNum, formatEther } from '@/utils'
import store from '@/store'

export interface UseColumnsByOrdersOptions {
  extendRows?: GridColDef<Order>[]
  denominated?: boolean
  personal?: boolean
}

export function useColumnsByOrders(options: UseColumnsByOrdersOptions = {}) {
  const { denominated, extendRows = [], personal } = options
  const { limit, mode } = useContext(MarketContext)
  const { t } = useTranslation()
  const { address } = useAccount()
  const config = useSnapshot(store.config)
  const symbol = denominated ? 'usd' : 'mxc'

  const timColumn: DataTableColDef<Order> = {
    field: 'time',
    headerName: t('Time'),
    minWidth: 110,
    flex: 1,
    renderCell(params) {
      return <span>{dayjs(params.row.time).format('MM-DD HH:mm:ss')}</span>
    },
  }
  const hexColumn: DataTableColDef<Order> = {
    field: 'hex',
    headerName: t('Location'),
    hidden: row => row.status !== 0,
    minWidth: 100,
    renderCell(params) {
      const hexagon = JSON.parse(params.row.json || '{}')?.hex
      return (
        <Condition is={params.row.status === 0 && hexagon} else="-">
          <LocationForHexagon hexagon={hexagon} />
        </Condition>
      )
    },
  }

  const columns: DataTableColDef<Order>[] = [
    {
      field: 'number',
      headerName: 'No.',
      width: 50,
      renderCell(params) {
        return `#${params.row.number}`
      },
    },
    {
      field: 'status',
      headerName: t('Event'),
      width: 70,
      renderCell(params) {
        const isBuyer
        = personal && params.row.buyer === address
        const mappings = {
          0: <span style={{ color: 'rgb(134,239,172)' }}>{t('Listing')}</span>,
          1: <span style={{ color: 'rgb(252,165,165)' }}>{isBuyer ? t('Purchased') : t('Sold')}</span>,
          2: <span style={{ color: 'rgb(100,116,139)' }}>{t('Cancelled')}</span>,
        }
        return mappings[params.row.status]
      },
    },
    {
      field: 'tick',
      headerName: t('Token'),
      flex: 1,
      maxWidth: 110,
      renderCell(params) {
        return <Flag find={params.row.tick} />
      },
    },
    {
      field: 'price',
      headerName: t('Price'),
      flex: 1,
      renderCell(params) {
        const unitPrice = formatEther(params.row.price).div(params.row.amount)
        const limitPrice = BigNum(limit).multipliedBy(unitPrice)
        const mxcPrice = mode === 'mint' ? limitPrice : unitPrice
        const usdPrice = BigNum(mxcPrice).multipliedBy(config.price)
        return <Price symbol={symbol} decimal={mode === 'mint' ? 2 : undefined} value={denominated ? usdPrice : mxcPrice} />
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
      flex: 1,
      renderCell(params) {
        const mxcPrice = formatEther(params.row.price)
        const usdPrice = BigNum(mxcPrice).multipliedBy(config.price)
        return <Price decimal={2} symbol={symbol} value={denominated ? usdPrice : mxcPrice} />
      },
    },
    {
      field: 'maker',
      headerName: t('From'),
      flex: 1,
      minWidth: 60,
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
      flex: 1,
      minWidth: 60,
      renderCell(params) {
        const address = params.row.status === 1
          ? params.row.maker
          : params.row.buyer
        if (!address)
          return '-'
        return <ChainLink type="address" href={address} />
      },
      hidden: (row) => {
        return !(row.status === 1 ? row.maker : row.buyer)
      },
    },
  ]

  const defaultColumns = [
    ...columns,
    !personal && hexColumn,
    timColumn,
    ...extendRows,
  ].filter(Boolean) as GridBaseColDef<Order, any, any>[]

  const souColumn = defaultColumns[defaultColumns.length - 1]
  const othColumns = defaultColumns.slice(0, defaultColumns.length - 1)

  const lasColumn: GridBaseColDef<Order, any, any> = {
    ...souColumn,
    minWidth: (souColumn.minWidth || 0) + 40,
    renderCell(params) {
      return (
        <div className="w-full flex items-center justify-between">
          {souColumn.renderCell?.(params) || params.row[souColumn.field]}
          <ExplorerButton row={params.row} />
        </div>
      )
    },
  }

  return [...othColumns, lasColumn]
}
