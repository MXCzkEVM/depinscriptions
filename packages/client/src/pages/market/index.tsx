import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout } from '@/layout'

function Page() {
  const { t } = useTranslation()
  return (
    <div className="py-24 text-center select-none">
      <div className="font-bold text-xl mb-10">
        {t('Coming soon stay tuned')}
      </div>
      <div className="">
        {t('Coming soon stay tuned Help')}
      </div>
    </div>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
