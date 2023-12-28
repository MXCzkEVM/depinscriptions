import { ReactElement } from 'react'
import { useAccount } from 'wagmi'
import { Layout } from '@/layout'
import { SearchResult } from '@/components/SearchResult'

function Page() {
  const { address } = useAccount()
  return (
    <div className="mt-6">
      <SearchResult address={address} />
    </div>
  )
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
