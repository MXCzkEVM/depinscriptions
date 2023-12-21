import type { PropsWithChildren, ReactNode } from 'react'

export interface FieldColProps {
  label: ReactNode
  value?: ReactNode
  dir?: 'col' | 'row'
  className?: string
}

function FieldCol(props: PropsWithChildren<FieldColProps>) {
  return (
    <div className={props.dir === 'col'
      ? `flex flex-col` + ` ${props.className}`
      : `flex flex-wrap justify-between mt-[1.375rem] items-center` + ` ${props.className}`}
    >
      <span className="text-[#999999]">{props.label}</span>
      <div className="text-white">{props.value || props.children}</div>
    </div>
  )
}

export default FieldCol
