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
import { Condition, DeployDialog, Empty, Flag, Icon, LinearProgressWithLabel, Refresh, TextFieldSearch, TextFieldTick, WaitIndexDialog } from '@/components'
import { Layout } from '@/layout'
import { Token } from '@/api/index.type'
import { percentage } from '@/utils'
import { getToken } from '@/api'

import { useEventBus, useGridPaginationFields, useRouterParams, useServerPagination, useWatch } from '@/hooks'

// Retrieve tokens deployed by a user
function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const [tab, setTab] = useRouterParams('tab', { default: 'all' })

  const [keyword, setKeyword] = useState('')
  const [holderDeployMl, openDeployModal] = useInjectHolder<unknown, { hash: string }>(DeployDialog)
  const [holderWaitingMl, openWaitIndexDialog] = useInjectHolder(WaitIndexDialog)

  const columns: GridColDef<Token>[] = [
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

  const mappings = {
    all: 1,
    progress: 2,
    complete: 3,
  }

  const [state, controls] = useServerPagination({
    limit: 10,
    resolve: model => getToken({ ...model, keyword, type: mappings[tab] }),
  })

  const gridPaginationFields = useGridPaginationFields({
    pagination: state.pagination,
    load: controls.load,
  })

  async function deploy() {
    const instance = openDeployModal()
    const { hash } = await instance
    await openWaitIndexDialog({ hash })
    await controls.reload()
  }

  useEventBus('dialog:deploy').on(deploy)

  useWatch([tab], controls.reload)

  return (
    <>
      <TextFieldTick onSearch={addr => router.push(`/tokens/query?address=${addr}`)} />
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
              onChange={(event, value) => setTab(value)}
              value={tab}
            >
              <Tab disableRipple value="all" label={t('All')} />
              <Tab disableRipple value="progress" label={t('In-Progress')} />
              <Tab disableRipple value="complete" label={t('Completed')} />
            </Tabs>
            <div className="flex-1 flex justify-end md:mr-6">
              <Refresh onClick={controls.reload} />
            </div>
            <TextFieldSearch
              className="hidden sm:inline-block"
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              placeholder={t('Token')}
              onSearch={controls.reload}
            />
          </div>
          <Condition is={state.value.length && !state.loading} else={<Empty loading={state.loading} />}>
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
