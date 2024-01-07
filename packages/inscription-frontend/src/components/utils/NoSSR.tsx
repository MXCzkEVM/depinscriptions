import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'
import React from 'react'

const _NoSSR = (props: PropsWithChildren) => <React.Fragment>{props.children}</React.Fragment>

export const NoSSR = dynamic(() => Promise.resolve(_NoSSR), {
  ssr: false,
})
