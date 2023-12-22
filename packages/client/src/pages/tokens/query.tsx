import type { ReactElement } from 'react'
import { Layout } from '@/layout'

function Page() {
  return <>131231</>
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
