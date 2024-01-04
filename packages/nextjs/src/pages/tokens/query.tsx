import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '@/layout'
import { FieldTickInput } from '@/components'
import { SearchResult } from '@/components/SearchResult'

function Page() {
  const router = useRouter()
  const address = router.query.address as any

  return (
    <>
      <FieldTickInput onSearch={addr => router.push(`/tokens/query?address=${addr}`)} />
      {address && <SearchResult address={address} />}
    </>
  )
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
