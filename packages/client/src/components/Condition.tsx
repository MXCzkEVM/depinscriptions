import type { PropsWithChildren, ReactNode } from 'react'

export interface ConditionProps {
  is: boolean | string | number | null | undefined
  if?: ReactNode
  else?: ReactNode
}
function Condition(props: PropsWithChildren<ConditionProps>) {
  return (
    <>
      {props.is ? (props.if || props.children) : props.else}
    </>
  )
}

export default Condition
