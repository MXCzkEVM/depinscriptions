import { Card } from 'flowbite-react'
import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { ReactElement } from 'react'

const Page: NextPageWithLayout = () => {
  return (
    <Card>Create an ERC20 token on zkEVM</Card>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
