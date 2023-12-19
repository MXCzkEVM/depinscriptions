import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation()
  return <>
    <div className='flex justify-between mt-[30px]'>
      <span>{t('Latest Scriptions')}</span>
      <div>
        <span></span>
      </div>
    </div>
  </>
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
