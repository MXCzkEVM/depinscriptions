import dynamic from "next/dynamic"
import React, { PropsWithChildren } from "react"

const _NoSSR = (props: PropsWithChildren) => <React.Fragment>{props.children}</React.Fragment>

const NoSSR = dynamic(() => Promise.resolve(_NoSSR), {
  ssr: false,
})

export default NoSSR