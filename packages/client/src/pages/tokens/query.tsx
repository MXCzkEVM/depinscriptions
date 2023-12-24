import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '@/layout'
import { FieldTickInput } from '@/components'

function Page() {
  const router = useRouter()
  return (
    <>
      <FieldTickInput onSearch={addr => router.push(`/tokens/query?address=${addr}`)} />
    </>
  )
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
