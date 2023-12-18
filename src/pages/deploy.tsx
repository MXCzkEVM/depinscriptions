import { Card } from 'flowbite-react'
import { NextPageWithLayout } from './_app'
import Layout from '@components/Layout'
import { ReactElement } from 'react'
import DeployTokenForm from '@components/forms/DeployTokenForm'

// Deploy - Deploy ERC20 tokens
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="mx-auto w-full">
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Deploy an ERC20 Token
          </h5>
          <DeployTokenForm />
        </Card>
      </div>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
