import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { ReactElement } from 'react'

const Page: NextPageWithLayout = () => {
  return <>
    <div className='flex justify-between mt-[30px]'>
      <span>Latest Scriptions</span>
      <div>
        <span></span>
      </div>
    </div>
  </>
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
