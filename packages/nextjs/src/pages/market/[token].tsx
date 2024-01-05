import { ArrowBackSharp, SwapHorizontalOutline } from '@ricons/ionicons5'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Tab, Tabs, Typography } from '@mui/material'
import { useInjectHolder } from '@overlays/react'
import { useAsyncFn } from 'react-use'
import { useSnapshot } from 'valtio'
import { utils } from 'ethers'
import { Empty, Flag, Icon, ListDialog, ListDialogProps, ListDialogResolved, Price, WaitIndexDialog } from '@/components'
import { Layout } from '@/layout'

import { useEventBus, useRouterQuery, useWhenever } from '@/hooks'
import Listed from '@/ui/market/Listed'
import Activities from '@/ui/market/Activities'
import MyOrder from '@/ui/market/MyOrder'
import { getMarketId } from '@/api'
import store from '@/store'
import { BigNum } from '@/utils'

import MarketContext from '@/ui/market/Context'

const mappings = {
  listed: () => <Listed />,
  activities: () => <Activities />,
  myOrders: () => <MyOrder />,
}
function Page() {
  const router = useRouter()
  const token = useRouterQuery('token')
  const config = useSnapshot(store.config)
  const { emit: reloadPage } = useEventBus('reload:page')

  const { t } = useTranslation()
  const [holderListMl, openListModal] = useInjectHolder<ListDialogProps, ListDialogResolved>(ListDialog)
  const [holderWaitingMl, openWaitIndexDialog] = useInjectHolder(WaitIndexDialog)
  const [tab, setTab] = useState('listed')
  const [perMint, setPerMint] = useState(true)
  const [{ value: data, loading }, reload] = useAsyncFn(async () => token && getMarketId({ id: token || '' }), [token])

  useWhenever(token, reload)

  if (!data)
    return <Empty loading={loading} />

  const limitPrice = BigNum(utils.formatEther(data.limitPrice)).toFixed(2)
  const price = BigNum(utils.formatEther(data.price).toString()).toFixed(2)
  const volume = BigNum(utils.formatEther(data.volume)).toFixed(2)
  const floorPrice = perMint ? limitPrice : price
  const usdUnitPrice = BigNum(price).multipliedBy(config.price).toFixed(4)
  const usdMintPrice = BigNum(limitPrice).multipliedBy(config.price).toFixed(4)

  async function list() {
    if (!data)
      return
    const { hash } = await openListModal({ data })
    await openWaitIndexDialog({ hash })
    await reload()
    reloadPage()
  }

  return (
    <MarketContext.Provider
      value={{
        mode: perMint ? 'mint' : 'unit',
        limit: data.limit,
      }}
    >
      {holderListMl}
      {holderWaitingMl}
      <div
        className="flex items-center mt-[3.125rem] mb-[2.25rem] gap-2 cursor-pointer"
        onClick={() => router.replace('/market')}
      >
        <Icon>
          <ArrowBackSharp />
        </Icon>
        <Typography variant="h6">{t('Tokens . Detail')}</Typography>
      </div>
      <div className="flex mb-5">
        <Typography variant="h6">{token}</Typography>
        <Flag text={false} size="32" find={token} />
      </div>
      <div className="flex gap-3 flex-wrap mb-10">
        <Price label={t('Floor Price')} symbol="mxc" value={Number(floorPrice) <= 0 ? '-' : floorPrice} />
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        {
          perMint
            ? <Price label={t('Per Mint')} symbol="usd" value={Number(usdMintPrice) <= 0 ? '-' : usdMintPrice} />
            : <Price label={t('Unit Price')} symbol="usd" value={Number(usdUnitPrice) <= 0 ? '-' : usdUnitPrice} />
        }
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        <Price label={t('Volume')} symbol="mxc" value={volume} />
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        <Price label={t('Owners')} value={data.holders} />
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        <Price label={t('Sales')} value={data.sales} />
        <Icon size="22" className="cursor-pointer" onClick={() => setPerMint(!perMint)}>
          <SwapHorizontalOutline />
        </Icon>
      </div>
      <div className="flex justify-between items-center border-b mb-8">
        <Tabs
          className="-mb-[1px]"
          variant="standard"
          onChange={(event, value) => setTab(value)}
          value={tab}
        >
          <Tab disableRipple value="listed" label={t('Listed')} />
          <Tab disableRipple value="activities" label={t('Activities')} />
          <Tab disableRipple value="myOrders" label={t('My Orders')} />
        </Tabs>
        <div>
          <Button type="button" variant="contained" onClick={list}>
            {t('List')}
          </Button>
        </div>
      </div>
      {mappings[tab]()}
    </MarketContext.Provider>

  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
