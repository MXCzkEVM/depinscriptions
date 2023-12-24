import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { ArrowBackSharp } from '@ricons/ionicons5'
import { Card, CardContent, Divider, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { Layout } from '@/layout'
import { Condition, DataGridHolders, Empty, FieldCol, Icon, LinearProgressWithLabel } from '@/components'
import { useRouterParams, useSendSatsTransaction } from '@/hooks'
import { useAsync } from 'react-use'
import { getTokenId } from '@/api'
import { getCurrentPosition, percentage, thousandBitSeparator } from '@/utils'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { latLngToCell } from 'h3-js'
import { useInjectHolder } from '@overlays/react'
import LocationModal from '@/components/LocationModal'
import { toUtf8String } from 'ethers/lib/utils'
function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const tokenId = useRouterParams('token', { replace: '/tokens' })
  const [tab, setTab] = useState(0)
  const [hexagon, setHexagon] = useState('')

  const { value: token, loading } = useAsync(() => getTokenId({ id: tokenId }))
  const { isLoading, sendTransaction, isConfigFetched } = useSendSatsTransaction({
    data: {
      p: 'msc-20',
      op: 'mint',
      hex: hexagon,
      tick: tokenId,
      amt: token?.limit || 0,
    }
  })

  const [holderModal, openLocationModal] = useInjectHolder(LocationModal)

  async function authorize() {
    await openLocationModal()
    const position = await getCurrentPosition()
    const hexagon = latLngToCell(
      position.coords.latitude,
      position.coords.longitude,
      7
    )
    setHexagon(hexagon)
  }

  async function mint() {
    if (!hexagon)
      await authorize()
    else
      sendTransaction?.()
  }
  useEffect(() => {
    if (hexagon && isConfigFetched) {
      sendTransaction?.()
    }
  }, [hexagon, isConfigFetched])
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
            <LoadingButton loading={isLoading} variant="contained" onClick={mint}>
              {t('Mint Directly')}
            </LoadingButton>
          </div>
          <Divider />
          <FieldCol label={t('Scription ID')} skeleton={!token}>
            {token?.deployHash}
          </FieldCol>
          <FieldCol label={t('Total Supply')} skeleton={!token}>
            {thousandBitSeparator(token?.total)}
          </FieldCol>
          <FieldCol label={t('Minted')} skeleton={!token}>
            {thousandBitSeparator(token?.minted)}
          </FieldCol>
          <FieldCol label={t('Limit Per Mint')} skeleton={!token}>
            {thousandBitSeparator(token?.limit)}
          </FieldCol>
          {/* <FieldCol label="Decimal" skeleton={!token}>
            0
          </FieldCol> */}
          <FieldCol label={t('Deploy By')} skeleton={!token}>
            {token?.deployHash}
          </FieldCol>
          <FieldCol label={t('Deploy Time')} skeleton={!token}>
            {dayjs(token?.deployTime).format('YYYY/MM/DD HH:mm:ss')}
          </FieldCol>
          <FieldCol label={t('Completed Time')} skeleton={!token}>
            {token?.completedTime && dayjs(token?.completedTime).format('YYYY/MM/DD HH:mm:ss') || '-'}
          </FieldCol>
          <FieldCol label={t('Holders')} skeleton={!token}>
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
            <Tab disableRipple label="Holders" />
            <Tab disableRipple label="Hexagons" />
          </Tabs>
          <Condition is={token} else={<Empty loading={!token || loading} />}>
            <DataGridHolders token={token} />
          </Condition>
        </CardContent>
      </Card>
      {holderModal}
    </>
  )
}


Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
