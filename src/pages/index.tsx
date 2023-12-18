import { Card } from 'flowbite-react'
import { NextPageWithLayout } from './_app'
import Layout from '@components/Layout'
import { ReactElement } from 'react'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="mx-auto w-3/5">
        <Card>Create an ERC20 token on zkEVM</Card>
      </div>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
