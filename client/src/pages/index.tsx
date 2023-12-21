import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Refresh } from '@ricons/ionicons5'
import { Layout } from '@/layout'
import { Icon, Scription } from '@/components'
import { MOCK_INSCRIPTIONS } from '@/config'

function Page() {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex justify-between mt-[30px]">
        <span className="text-2xl text-primary font-bold">{t('Latest Scriptions')}</span>
        <div className="flex gap-2 items-center cursor-pointer">
          <span>{t('Refresh')}</span>
          <Icon size={18}>
            <Refresh />
          </Icon>
        </div>
      </div>
      <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
        {MOCK_INSCRIPTIONS.map(item => <Scription key={item.id} data={item} />)}
      </div>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
