import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import NextHead from 'next/head'
import React from 'react'
import { WagmiConfig, useAccount } from 'wagmi'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material/styles'
import { chains, client } from '@/utils/wagmi'
import { i18n } from '@/plugins'
import { MountsProvider, NoSSR, PleaseConnectWallet } from '@/components'
import type { AppPropsWithLayout } from '@/types'
import { darkTheme, fontInter } from '@/config'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// If wallet is connected -> display app
// Else -> display connect prompt
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [mounted, setMounted] = React.useState(false)
  const { isConnected } = useAccount()

  const layout = Component.layout ?? (page => page)
  React.useEffect(() => setMounted(true), [])

  return (
    <>
      <div className={fontInter.className}>
        <NextHead>
          <title>MXC zkEVM ERC20</title>
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
