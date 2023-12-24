import { type ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Refresh } from '@ricons/ionicons5'
import { useAsyncFn, useMount } from 'react-use'
import { Layout } from '@/layout'
import { Condition, Empty, Icon, Scription } from '@/components'
import { getInscription } from '@/api'
import { InscriptionDto } from '@/api/index.type'

function Page() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [inscriptions, setInscriptions] = useState<InscriptionDto[]>([])
  const [fetched, setFetched] = useState(false)

  const [state, fetchInscriptions] = useAsyncFn(async (page: number) => {
    if (fetched)
      return
    const { data } = await getInscription({ page, limit: 12 })
    if (page === 1)
      setInscriptions([...data])
    else
      setInscriptions([...inscriptions, ...data])
    setPage(page)
    setFetched(!data.length)
  })

  useMount(() => fetchInscriptions(page))

  return (
    <>
      <div className="flex justify-between mt-[30px]">
        <span className="text-2xl text-primary font-bold">{t('Latest Scriptions')}</span>
        <div className="flex gap-2 items-center cursor-pointer" onClick={() => fetchInscriptions(1)}>
          <span>{t('Refresh')}</span>
          <Icon size={18}>
            <Refresh />
          </Icon>
        </div>
      </div>

      <Condition is={inscriptions.length} else={<Empty loading={state.loading} />}>
        <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">
          {inscriptions.map(item => <Scription key={item.hash} data={item} />)}
        </div>
      </Condition>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
