import { Button, Card, CardContent, Tab, Tabs, TextField, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import React, { useEffect, useState } from 'react'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useInjectHolder } from '@overlays/react'
import { useTranslation } from 'react-i18next'
import { Search } from '@ricons/ionicons5'
import { useAsyncFn, useMount } from 'react-use'
import { Condition, DeployDialog, Empty, FieldTickInput, Icon, LinearProgressWithLabel } from '@/components'
import { Layout } from '@/layout'
import { TickDto } from '@/api/index.type'
import { percentage } from '@/utils'
import { getToken } from '@/api'

// Retrieve tokens deployed by a user
function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const [type, setType] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [holder, deploy] = useInjectHolder<unknown, any>(DeployDialog)
  const [ticks, setTicks] = useState<TickDto[]>([])
  const [total, setTotal] = useState(0)

  const columns: GridColDef<TickDto>[] = [
    { field: 'tick', headerName: 'Token', minWidth: 120, flex: 1 },
    {
      field: 'deployTime',
      headerName: t('Deploy Time'),
      minWidth: 180,
      flex: 1,
      renderCell(params) {
        return dayjs(params.row.deployTime).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      field: 'minted',
      headerName: t('Progress'),
      minWidth: 210,
      flex: 1,
      renderCell(params) {
        return (
          <div className="w-full mr-6">
            <LinearProgressWithLabel value={percentage(params.row.total, params.row.minted)} />
          </div>
        )
      },
    },
    { field: 'holders', headerName: t('Holders'), minWidth: 150, flex: 1 },
    {
      field: 'trxs',
      headerName: t('Transactions'),
      minWidth: 180,
      flex: 1,
      renderCell(params) {
        return (
          <div className="flex justify-between w-full">
            <span>{params.row.trxs}</span>
          </div>
        )
      },
    },
  ]

  const [state, fetchTicks] = useAsyncFn(async (page: number) => {
    const { data, total } = await getToken({ keyword, page, type, limit: 15 })
    setTotal(total)
    setTicks(data)
  })

  useMount(() => fetchTicks(1))
  useEffect(() => { fetchTicks(page) }, [type])

  return (
    <>
      <FieldTickInput onSearch={addr => router.push(`/tokens/query?address=${addr}`)} />
      <div className="mb-4 flex justify-between">
        <Typography variant="h6" component="span">
          {t('The full list of tokens')}
        </Typography>
        <Button onClick={deploy} type="button" variant="contained">{t('Deploy')}</Button>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <Tabs
              variant="standard"
              onChange={(event, value) => setType(value)}
              value={type}
            >
              <Tab disableRipple value={1} label={t('All')} />
              <Tab disableRipple value={2} label={t('In-Progress')} />
              <Tab disableRipple value={3} label={t('Completed')} />
            </Tabs>
            <div className="relative hidden md:block">
              <TextField value={keyword} onChange={event => setKeyword(event.target.value)} color="secondary" size="small" variant="outlined" placeholder={t('Token')} />
              <Icon className="absolute right-2 top-2 cursor-pointer" onClick={() => fetchTicks(1)}>
                <Search />
              </Icon>
            </div>
          </div>
          <Condition is={ticks.length} else={<Empty loading={state.loading} />}>
            <DataGrid
              paginationMode="server"
              className="border-none data-grid-with-row-pointer"
              rows={ticks}
              rowCount={Math.floor(total / 15)}
              getRowId={row => row.tick}
              columns={columns}
              hideFooterSelectedRowCount
              paginationModel={{ page, pageSize: 15 }}
              onPaginationModelChange={model => setPage(model.page)}
              onRowClick={({ row }) => router.push(`/tokens/detail?token=${row.tick}`)}
            />
          </Condition>
        </CardContent>
      </Card>
      {holder}
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
