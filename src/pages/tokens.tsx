import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { TextInput } from 'flowbite-react'
import { ReactElement } from 'react'
import React from 'react'


// Retrieve tokens deployed by a user
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="mx-auto my-8 w-full text-center">
        <span className="md:text-3xl text-center mt-[41px] mp:mb-[18px] select-none"> Check out mxc-20 balance of the address. </span>
      </div>
      <TextInput placeholder='asdasd' />
    </>
  )
}

Page.layout = function layout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
