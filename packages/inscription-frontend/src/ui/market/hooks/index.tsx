import { GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useSnapshot } from 'valtio'
import Link from 'next/link'
import dayjs from 'dayjs'
import { ArrowRedoCircleOutline } from '@ricons/ionicons5'
import MarketContext from '../Context'
import { ExplorerButton } from '../components'
import { Order } from '@/api/index.type'
import { ChainLink, Condition, DataTableColDef, Flag, Icon, Price } from '@/components'
import { BigNum, formatEther } from '@/utils'
import store from '@/store'

export interface UseColumnsByOrdersOptions {
  extendRows?: GridColDef<Order>[]
  denominated?: boolean
  hideExplorerIcon?: boolean
}

export function useColumnsByOrders(options: UseColumnsByOrdersOptions = {}) {
  const { denominated, extendRows = [] } = options
  const { t } = useTranslation()
  const { limit, mode } = useContext(MarketContext)
  const symbol = denominated ? 'usd' : 'mxc'
  const config = useSnapshot(store.config)

  const columns: DataTableColDef<Order>[] = [
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
        }
        return mappings[params.row.status]
      },
    },
    {
      field: 'tick',
      headerName: t('Token'),
      minWidth: 90,
      renderCell(params) {
        return <Flag find={params.row.tick} />
      },
    },
    {
      field: 'price',
      headerName: t('Price'),
      renderCell(params) {
        const unitPrice = formatEther(params.row.price).div(params.row.amount)
        const limitPrice = BigNum(limit).multipliedBy(unitPrice)
        const mxcPrice = mode === 'mint' ? limitPrice : unitPrice
        const usdPrice = BigNum(mxcPrice).multipliedBy(config.price)
        return <Price decimal={2} symbol={symbol} value={denominated ? usdPrice : mxcPrice} />
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
        const mxcPrice = formatEther(params.row.price)
        const usdPrice = BigNum(mxcPrice).multipliedBy(config.price)
        return <Price decimal={2} symbol={symbol} value={denominated ? usdPrice : mxcPrice} />
      },
    },
    {
      field: 'maker',
      headerName: t('From'),
      minWidth: 180,
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
      minWidth: 180,
      flex: 1,
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
    {
      field: 'time',
      headerName: t('Time'),
      minWidth: 160,
      flex: 1,
      renderCell(params) {
        return (
          <div className="w-full flex justify-between">
            <span>{dayjs(params.row.time).format('MM-DD HH:mm:ss')}</span>
            <ExplorerButton hidden={options.hideExplorerIcon} row={params.row} />
          </div>
        )
      },
    },
  ]

  const cols = [...columns, ...extendRows]

  return cols
}
