import '@rainbow-me/rainbowkit/styles.css'
import '@styles/globals.css'
import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { NextPage } from 'next'
import NextHead from 'next/head'
import { ReactElement, ReactNode } from 'react'
import React from 'react'
import { useAccount, WagmiConfig } from 'wagmi'
import { chains, client } from '@utils/wagmi'
import { Inter } from 'next/font/google'
import { useTranslation, I18nextProvider } from 'react-i18next'
import i18n from '@plugins/i18n'
import NoSSR from '@components/NoSSR'

const inter = Inter({ subsets: ['latin'] })

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  layout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// Connect wallet helper component
const PleaseConnectWallet = (): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <div className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-lg font-semibold leading-8 text-indigo-600">
            {t('Please connect your wallet')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('A better way to mxc20 tokens')}
          </p>
          <div className="flex flex-col items-center mt-6 text-lg leading-8 text-gray-600">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  )
}

// If wallet is connected -> display app
// Else -> display connect prompt
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [mounted, setMounted] = React.useState(false)
  const { isConnected } = useAccount()

  const layout = Component.layout ?? ((page) => page)

  React.useEffect(() => setMounted(true), [])
  return (
    <>
      <div className={inter.className}>
        <WagmiConfig client={client}>
          <RainbowKitProvider chains={chains}>
            <NextHead>
              <title>MXC zkEVM ERC20</title>
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            </NextHead>
            <NoSSR>
              <I18nextProvider i18n={i18n}>
                {isConnected ? (
                  <>{mounted && layout(<Component {...pageProps} />)}</>
                ) : (
                  <>
                    <PleaseConnectWallet />
                  </>
                )}
              </I18nextProvider>
            </NoSSR>
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
    </>
  )
}
