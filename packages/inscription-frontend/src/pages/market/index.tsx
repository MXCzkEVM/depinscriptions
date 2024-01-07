import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, Typography } from '@mui/material'
import { useSnapshot } from 'valtio'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useMount } from 'react-use'
import { utils } from 'ethers'
import { Layout } from '@/layout'
import { Condition, Empty, Flag, Price, TextFieldSearch } from '@/components'
import store from '@/store'
import { BigNum, thousandBitSeparator } from '@/utils'
import { useGridPaginationFields, useServerPagination } from '@/hooks'
import { getMarket, getToken } from '@/api'
import { MarketRaw } from '@/api/index.type'

function Page() {
  const { t } = useTranslation()
  const config = useSnapshot(store.config)
  const router = useRouter()

  const columns: GridColDef<MarketRaw>[] = [
    {
      field: 'tick',
      headerName: t('Token'),
      minWidth: 90,
      flex: 1,
      renderCell(params) {
        return <Flag find={params.row.tick} />
      },
    },
    {
      field: 'price',
      headerName: t('Floor Price'),
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        const mxc = utils.formatEther(params.row.price)
        const usd = BigNum(mxc).multipliedBy(config.price)
        if (Number(usd) <= 0)
          return '-'
        return <Price symbol="usd" value={usd.toFixed(6)} />
      },
    },
    {
      field: 'volume',
      headerName: t('24h Volume'),
      minWidth: 150,
      flex: 1,
      renderCell(params) {
        const mxc = utils.formatEther(params.row.volume)
        return <Price symbol="mxc" value={mxc} />
      },
    },
    {
      field: 'sales',
      headerName: t('24h Sales'),
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        return thousandBitSeparator(params.row.sales)
      },
    },
    {
      field: 'holders',
      headerName: t('Owners'),
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        return thousandBitSeparator(params.row.holders)
      },
    },
    {
      field: 'totalVolume',
      headerName: t('Total Volume'),
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        const mxc = utils.formatEther(params.row.totalVolume)
        return <Price symbol="mxc" value={mxc} />
      },
    },
    {
      field: 'totalSales',
      headerName: t('Total Sales'),
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        return thousandBitSeparator(params.row.totalSales)
      },
    },
    {
      field: 'marketCap',
      headerName: t('Market Cap'),
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        const usd = BigNum(utils.formatEther(params.row.marketCap)).multipliedBy(config.price)
        return <Price symbol="usd" value={usd} />
      },
    },
    {
      field: 'listed',
      headerName: t('Listed'),
      minWidth: 120,
      flex: 1,
      renderCell(params) {
        return thousandBitSeparator(params.row.listed)
      },
    },
  ]

  const [keyword, setKeyword] = useState('')
  const [price, setPrice] = useState('1')

  const [state, controls] = useServerPagination({
    resolve: async (model) => {
      const response = await getMarket({ ...model })
      setPrice(response.price)
      return response
    },
    limit: 10,
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  useMount(controls.reload)

  const marketCap = BigNum(utils.formatEther(price)).multipliedBy(config.price).toFixed(4)

  return (
    <>
      <div className="mx-auto mt-9 mb-14 w-full text-center">
        <span className="md:text-3xl text-center mt-[41px] mp:mb-[18px] select-none text-[#6300ff]">
          {t('Total MXC-20 Market Cap', { price: thousandBitSeparator(marketCap) })}
        </span>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="token_page_step_0_5">
          <div className="mb-4 flex justify-between items-center">
            <Typography variant="h6">{t('Trending Tokens')}</Typography>
            <TextFieldSearch
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              placeholder={t('Token')}
            />
          </div>
          <Condition is={state.value.length} else={<Empty loading={state.loading} />}>
            <DataGrid
              className="border-none data-grid-with-row-pointer"
              {...gridPaginationFields}
              loading={state.loading}
              getRowId={row => row.tick}
              rows={state.value}
              columns={columns}
              onRowClick={({ row }) => router.push(`/market/${row.tick}`)}
            />
          </Condition>
        </CardContent>
      </Card>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page