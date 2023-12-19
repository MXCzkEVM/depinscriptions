import { Card } from 'flowbite-react'
import { NextPageWithLayout } from './_app'
import Layout from '@layout/Layout'
import { ReactElement, useState } from 'react'
import ERC20_FACTORY, { FACTORY_ABI_FULL } from '@config/abis/erc20factory'
import { ERC20_IMPL_ABI_FULL } from '@config/abis/erc20'
import { useAccount, useContractRead, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import React from 'react'

type tokenInfo = {
  address: `0x${string}`
  name: string
  symbol: string
  supply: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
