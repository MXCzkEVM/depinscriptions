import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  layout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout }
