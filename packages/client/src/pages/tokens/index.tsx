import { Button, Card, CardContent, Tab, Tabs, TextField, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import React, { useRef, useState } from 'react'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useInjectHolder } from '@overlays/react'
import { useTranslation } from 'react-i18next'
import { Search } from '@ricons/ionicons5'
import { Deferred } from '@hairy/utils'
import { Condition, CountryFlag, DeployDialog, Empty, FieldTickInput, Icon, LinearProgressWithLabel } from '@/components'
import { Layout } from '@/layout'
import { TickDto } from '@/api/index.type'
import { percentage } from '@/utils'
import { getToken } from '@/api'
import WaitingIndexModal from '@/components/WaitingIndexModal'
import { useGridPaginationFields, useMittOn, useServerPagination, useWatch } from '@/hooks'

// Retrieve tokens deployed by a user
function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const [type, setType] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [holderDeployMl, openDeployModal] = useInjectHolder<unknown, { hash: string }>(DeployDialog)
  const [holderWaitingMl, openWaitingIndexModal] = useInjectHolder(WaitingIndexModal)

  const columns: GridColDef<TickDto>[] = [
    {
      field: 'tick',
      headerName: t('Token'),
      minWidth: 90,
      flex: 1,
      renderCell(params) {
        return <CountryFlag find={params.row.tick} />
      },
    },
    {
      field: 'deployTime',
      headerName: t('Deploy Time'),
      minWidth: 160,
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
    { field: 'holders', headerName: t('Holders'), minWidth: 120, flex: 1 },
    // {
    //   field: 'trxs',
    //   headerName: t('Transactions'),
    //   minWidth: 180,
    //   flex: 1,
    //   renderCell(params) {
    //     return (
    //       <div className="flex justify-between w-full">
    //         <span>{params.row.trxs}</span>
    //       </div>
    //     )
    //   },
    // },
  ]

  const [state, controls] = useServerPagination({
    limit: 10,
    resolve: model => getToken({ ...model, keyword, type }),
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  async function deploy() {
    const { hash } = await openDeployModal()
    await openWaitingIndexModal({ hash })
    await controls.reload()
  }

  useMittOn('inscription:deploy-open', deploy)
  useWatch([type], controls.reload)

  return (
    <>
      <FieldTickInput onSearch={addr => router.push(`/tokens/query?address=${addr}`)} />
      <div className="mb-4 flex justify-between items-center">
        <Typography className="text-base sm:text-lg" variant="h6" component="span">
          {t('The full list of tokens')}
        </Typography>
        <Button className="token_page_step_2" onClick={deploy} type="button" variant="contained">{t('Deploy')}</Button>
      </div>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent className="token_page_step_0_5">
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
              <TextField
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                color="secondary"
                size="small"
                variant="outlined"
                placeholder={t('Token')}
              />
              <Icon className="absolute right-2 top-2 cursor-pointer" onClick={controls.reload}>
                <Search />
              </Icon>
            </div>
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
      {holderDeployMl}
      {holderWaitingMl}
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
