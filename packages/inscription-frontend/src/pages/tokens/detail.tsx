import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { ArrowBackSharp } from '@ricons/ionicons5'
import { Card, CardContent, Divider, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useAsyncFn, useMount } from 'react-use'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Layout } from '@/layout'
import {
  ChainLink,
  DataTableHexagons,
  DataTableHolders,
  Flag,
  Icon,
  LinearProgressWithLabel,
  MintButton,
  TextColumn,
} from '@/components'
import { useEventBus, useRouterParams } from '@/hooks'
import { getTokenId } from '@/api'
import { percentage, thousandBitSeparator } from '@/utils'

function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const [tokenId] = useRouterParams('token', {
    replace: '/tokens',
    persistant: true,
  })

  const [tab, setTab] = useState(0)

  const [{ value: token, loading }, reload] = useAsyncFn(() => getTokenId({ id: tokenId }), [tokenId])

  const isPageLoading = useMemo(() => loading || !token, [loading, token])

  useMount(reload)

  useEventBus('reload:page').on(reload)

  return (
    <>
      <div className="flex items-center mt-[3.125rem] mb-[2.25rem] gap-2 cursor-pointer" onClick={() => router.replace('/tokens')}>
        <Icon>
          <ArrowBackSharp />
        </Icon>
        <span className="text-2xl">
          <Flag find={tokenId} />
        </span>
        <div className="bg-white text-xs py-[2px] px-[4px] rounded-lg bg-opacity-30">
          MSC-20
        </div>
      </div>
      <div className="mb-[1.75rem]">
        <LinearProgressWithLabel height="8px" value={percentage(token?.total || 0, token?.minted || 0)} />
      </div>
      <Card className="mb-6" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent>
          <div className="mb-3 flex justify-between">
            <span className="text-xl font-bold">{t('Overview')}</span>
            {!token?.completedTime && <MintButton className="token_detail_page_step_1" token={token} />}
          </div>
          <Divider />
          <TextColumn label={t('Scription ID')} skeleton={isPageLoading}>
            <ChainLink type="hash" href={token?.deployHash} />
          </TextColumn>
          <TextColumn label={t('Total Supply')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.total)}
          </TextColumn>
          <TextColumn label={t('Minted')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.minted)}
          </TextColumn>
          <TextColumn label={t('Limit Per Mint')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.limit)}
          </TextColumn>
          {/* <TextColumn label="Decimal" skeleton={isPageLoading}>
            0
          </TextColumn> */}
          <TextColumn label={t('Deploy By')} skeleton={isPageLoading}>
            <ChainLink type="address" href={token?.creator} />
          </TextColumn>
          <TextColumn label={t('Deploy Time')} skeleton={isPageLoading}>
            {dayjs(token?.deployTime).format('YYYY/MM/DD HH:mm:ss')}
          </TextColumn>
          <TextColumn label={t('Completed Time')} skeleton={isPageLoading}>
            {token?.completedTime
              ? dayjs(token?.completedTime).format('YYYY/MM/DD HH:mm:ss')
              : '-'}
          </TextColumn>
          <TextColumn label={t('Holders')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.holders)}
          </TextColumn>
          {/* <TextColumn label={t('Total Transactions')} skeleton={!token}>
            {thousandBitSeparator(token?.trxs)}
          </TextColumn> */}
        </CardContent>
      </Card>
      <Card style={{ background: 'rgb(22 21 21 / 20%)' }}>
        <CardContent>
          <Tabs
            variant="fullWidth"
            onChange={(event, value) => setTab(value)}
            value={tab}
          >
            <Tab disableRipple value={0} label={t('Holders')} />
            <Tab disableRipple value={1} label={t('Hexagon locations')} />
          </Tabs>
          {
            tab === 0
              ? <DataTableHolders token={token} />
              : <DataTableHexagons token={token} />
          }
        </CardContent>
      </Card>
    </>
  )
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
