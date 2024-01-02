import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, TextField, Typography } from '@mui/material'
import { useSnapshot } from 'valtio'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { Layout } from '@/layout'
import { Condition, Empty, SearchTextField } from '@/components'
import store from '@/store'
import { thousandBitSeparator } from '@/utils'
import { useGridPaginationFields, useServerPagination } from '@/hooks'
import { getToken } from '@/api'

function Page() {
  const { t } = useTranslation()
  const config = useSnapshot(store.config)
  const router = useRouter()

  const columns: GridColDef<any>[] = [
    {
      field: 'tick',
      headerName: t('Token'),
      minWidth: 90,
      flex: 1,
      renderCell() {
        // return <CountryFlag find={params.row.tick} />
        return 'AVAV'
      },
    },
    {
      field: 'floorPrice',
      headerName: t('Floor Price'),
      minWidth: 150,
      flex: 1,
      renderCell() {
        return '$ 1.8545'
      },
    },
    {
      field: '24hVolume',
      headerName: t('24h Volume'),
      minWidth: 150,
      flex: 1,
      renderCell() {
        return '8,873.39'
      },
    },
    {
      field: '24hSales',
      headerName: t('24h Sales'),
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'owners',
      headerName: t('Owners'),
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'totalVolume',
      headerName: t('Total Volume'),
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'totalSales',
      headerName: t('Total Sales'),
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'marketCap',
      headerName: t('Market Cap'),
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'listed',
      headerName: t('Listed'),
      minWidth: 120,
      flex: 1,
    },
  ]

  const [keyword, setKeyword] = useState('')

  const [state, controls] = useServerPagination({
    resolve: model => getToken({ ...model, keyword, type: 1 }),
    limit: 10,
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  return (
    <>
      <div className="mx-auto mt-9 mb-14 w-full text-center">
        <span className="md:text-3xl text-center mt-[41px] mp:mb-[18px] select-none text-[#6300ff]">
          {t('Total MXC-20 Market Cap', { price: thousandBitSeparator(config.price) })}
        </span>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="token_page_step_0_5">
          <div className="mb-4 flex justify-between items-center">
            <Typography variant="h6">{t('Trending Tokens')}</Typography>
            <SearchTextField
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
              getRowClassName={params => params.row.tick === state.value[0].tick ? 'token_page_step_1' : ''}
              onRowClick={({ row }) => router.push(`/tokens/detail?token=${row.tick}`)}
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
