import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { ArrowBackSharp } from '@ricons/ionicons5'
import { Card, CardContent, Divider, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useAsync } from 'react-use'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Layout } from '@/layout'
import { ChainLink, DataTableHexagons, DataTableHolders, FieldCol, Icon, LinearProgressWithLabel, MintButton } from '@/components'
import { useRouterParams } from '@/hooks'
import { getTokenId } from '@/api'
import { percentage, thousandBitSeparator } from '@/utils'

function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const tokenId = useRouterParams('token', { replace: '/tokens' })

  const [tab, setTab] = useState(0)

  const { value: token, loading } = useAsync(() => getTokenId({ id: tokenId }))

  const isPageLoading = useMemo(() => loading || !token, [loading, token])

  return (
    <>
      <div className="flex items-center mt-[3.125rem] mb-[2.25rem] gap-2 cursor-pointer" onClick={() => router.replace('/tokens')}>
        <Icon>
          <ArrowBackSharp />
        </Icon>
        <span className="text-2xl">{tokenId}</span>
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
            <MintButton token={token} />
          </div>
          <Divider />
          <FieldCol label={t('Scription ID')} skeleton={isPageLoading}>
            <ChainLink type="hash" href={token?.deployHash} />
          </FieldCol>
          <FieldCol label={t('Total Supply')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.total)}
          </FieldCol>
          <FieldCol label={t('Minted')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.minted)}
          </FieldCol>
          <FieldCol label={t('Limit Per Mint')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.limit)}
          </FieldCol>
          {/* <FieldCol label="Decimal" skeleton={isPageLoading}>
            0
          </FieldCol> */}
          <FieldCol label={t('Deploy By')} skeleton={isPageLoading}>
            <ChainLink type="address" href={token?.creator} />
          </FieldCol>
          <FieldCol label={t('Deploy Time')} skeleton={isPageLoading}>
            {dayjs(token?.deployTime).format('YYYY/MM/DD HH:mm:ss')}
          </FieldCol>
          <FieldCol label={t('Completed Time')} skeleton={isPageLoading}>
            {token?.completedTime
              ? dayjs(token?.completedTime).format('YYYY/MM/DD HH:mm:ss')
              : ''}
          </FieldCol>
          <FieldCol label={t('Holders')} skeleton={isPageLoading}>
            {thousandBitSeparator(token?.holders)}
          </FieldCol>
          {/* <FieldCol label={t('Total Transactions')} skeleton={!token}>
            {thousandBitSeparator(token?.trxs)}
          </FieldCol> */}
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
            <Tab disableRipple value={1} label={t('Hexagons')} />
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
