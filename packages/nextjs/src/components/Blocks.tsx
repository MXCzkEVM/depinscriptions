import { PropsWithChildren } from 'react'

function Blocks(props: PropsWithChildren) {
  return <div className="grid mp:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[1.25rem] mt-[2rem]">{props.children}</div>
}

export default Blocks
