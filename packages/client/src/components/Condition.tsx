import type { PropsWithChildren } from 'react'

export interface ConditionProps {
  is: boolean | string | number | null | undefined
}
function Condition(props: PropsWithChildren<ConditionProps>) {
  return (
    <>
      {props.is ? props.children : undefined}
    </>
  )
}

export default Condition
