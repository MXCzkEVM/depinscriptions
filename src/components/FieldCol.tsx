import { PropsWithChildren, ReactNode } from "react"

export interface FieldColProps {
  label: ReactNode
  value?: ReactNode
}

function FieldCol(props: PropsWithChildren<FieldColProps>) {
  return (
    <div className="flex justify-between items-center mt-[1.375rem]">
      <span className="text-[#999999]">{props.label}</span>
      <div className="flex items-center text-white pl-[50px]">{props.value || props.children}</div>
    </div>
  )
}

export default FieldCol