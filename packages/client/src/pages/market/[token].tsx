import { ArrowBackSharp } from '@ricons/ionicons5'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Tab, Tabs, Typography } from '@mui/material'
import { useInjectHolder } from '@overlays/react'
import { Icon, ListDialog, Price } from '@/components'
import { Layout } from '@/layout'
import Flag from '@/components/Flag'
import { useRouterParams } from '@/hooks'
import Listed from '@/ui/market/Listed'
import Activities from '@/ui/market/Activities'
import MyOrder from '@/ui/market/MyOrder'

function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  const [tab, setTab] = useState('listed')

  const mappings = {
    listed: () => <Listed />,
    activities: () => <Activities />,
    myOrders: () => <MyOrder />,
  }

  const [holder, openListDialog] = useInjectHolder(ListDialog)

  return (
    <>
      {holder}
      <div className="flex items-center mt-[3.125rem] mb-[2.25rem] gap-2 cursor-pointer" onClick={() => router.replace('/market')}>
        <Icon>
          <ArrowBackSharp />
        </Icon>
        <Typography variant="h6">{t('Tokens / Detail')}</Typography>
      </div>
      <div className="flex mb-5">
        <Typography variant="h6">AVAV</Typography>
        <Flag size="32" find="CRI" />
      </div>
      <div className="flex gap-3 flex-wrap mb-10">
        <Price label="Floor Price" symbol="mxc" value="0.0426" />
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        <Price label="Per Mint" symbol="usd" value="1.8255" />
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        <Price label="Volume" symbol="mxc" value="839913.95" />
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        <Price label="Owners" value="41286" />
        <Divider className="hidden md:block" orientation="vertical" flexItem />
        <Price label="Sales" value="51144" />
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
          <Button type="button" variant="contained" onClick={() => openListDialog({ tick: '' })}>{t('List')}</Button>
        </div>
      </div>
      {mappings[tab]()}
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
