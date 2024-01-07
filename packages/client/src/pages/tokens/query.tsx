import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '@/layout'
import { SearchByAddress, TextFieldTick } from '@/components'

function Page() {
  const router = useRouter()
  const address = router.query.address as any

  return (
    <>
      <TextFieldTick onSearch={addr => router.push(`/tokens/query?address=${addr}`)} />
      {address && <SearchByAddress address={address} />}
    </>
  )
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
