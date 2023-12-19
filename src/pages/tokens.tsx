import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { ReactElement } from 'react'
import React from 'react'


// Retrieve tokens deployed by a user
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="mx-auto w-full text-center">
      <span className="italic-title text-primary mp:text-26 md:text-3xl text-center mt-[41px] mp:mb-[18px] md:mb-50 select-none"> Check out mxc-20 balance of the address. </span>
      </div>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
