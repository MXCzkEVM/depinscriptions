import Icon from '@components/Icon'
import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Refresh } from '@ricons/ionicons5'
import { inscriptions } from '@config/mocks'
import Scription from '@components/Scription'

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation()
  return <>
    <div className='flex justify-between mt-[30px]'>
      <span className='text-2xl text-primary font-bold'>{t('Latest Scriptions')}</span>
      <div className='flex gap-2 items-center cursor-pointer'>
        <span>{t('Refresh')}</span>
        <Icon size={18}>
          <Refresh />
        </Icon>
      </div>
    </div>
    <div className='grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]'>
      {inscriptions.map(item => <Scription key={item.id} data={item} />)}
    </div>
  </>
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
