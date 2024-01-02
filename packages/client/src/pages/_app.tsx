import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.scss'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import NextHead from 'next/head'
import React from 'react'
import { WagmiConfig, useAccount } from 'wagmi'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material/styles'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMount } from 'react-use'
import { useSnapshot } from 'valtio'
import { chains, client } from '@/utils/wagmi'
import { FetchResponseInterceptFn, fetchResponseIntercept, i18n } from '@/plugins'
import { MountsProvider, NoSSR, PleaseConnectWallet } from '@/components'
import type { AppPropsWithLayout } from '@/types'
import { darkTheme, fontInter } from '@/config'
import { helperGetSimplePrice } from '@/service'
import store from '@/store'

dayjs.extend(relativeTime)

// If wallet is connected -> display app
// Else -> display connect prompt
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { isConnected } = useAccount()
  const mounted = useMounted()

  const layout = Component.layout ?? (page => page)

  useFetchResponseIntercept(async (response) => {
    const data = await response.clone().json()
    if (data.error)
      throw new Error(data.message)
    return response
  })
  useMount(async () => {
    const { mxc: { usd } } = await helperGetSimplePrice({ ids: 'mxc', vs: 'usd' })
    store.config.price = usd
  })

  return (
    <>
      <div className={fontInter.className}>
        <NextHead>
          <title>DePINscription</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </NextHead>
        <MountsProvider install={[
          { component: WagmiConfig, props: { client } },
          { component: RainbowKitProvider, props: { chains } },
          { component: ThemeProvider, props: { theme: darkTheme } },
          { component: NoSSR },
          { component: I18nextProvider, props: { i18n } },
        ]}
        >
          {isConnected
            ? (mounted && layout(<Component {...pageProps} />))
            : <PleaseConnectWallet />}
        </MountsProvider>
      </div>
    </>
  )
}

function useMounted() {
  const [mounted, setMounted] = React.useState(false)
  useMount(() => setMounted(true))
  return mounted
}

function useFetchResponseIntercept(cb: FetchResponseInterceptFn) {
  useMount(() => fetchResponseIntercept(cb))
}
