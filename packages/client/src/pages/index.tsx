import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout } from '@/layout'
import { DataGridScriptions, Refresh } from '@/components'

function Page() {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex justify-between mt-[30px]">
        <span className="text-2xl text-primary font-bold">{t('Latest Scriptions')}</span>
        <Refresh />
      </div>
      <DataGridScriptions />
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
