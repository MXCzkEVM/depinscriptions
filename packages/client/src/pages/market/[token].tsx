import { ArrowBackSharp } from '@ricons/ionicons5'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider, Typography } from '@mui/material'
import { Icon, Price } from '@/components'
import { Layout } from '@/layout'
import Flag from '@/components/Flag'

function Page() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
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
      <div className="flex gap-3 flex-wrap">
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
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
