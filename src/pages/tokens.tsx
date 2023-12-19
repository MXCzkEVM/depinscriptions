import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { ReactElement } from 'react'
import React from 'react'


// Retrieve tokens deployed by a user
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="mx-auto w-full text-center">
      </div>
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
