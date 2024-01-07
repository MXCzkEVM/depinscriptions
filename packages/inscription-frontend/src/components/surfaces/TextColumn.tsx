import { Skeleton } from '@mui/material'
import type { PropsWithChildren, ReactNode } from 'react'

export interface TextColumnProps {
  label: ReactNode
  value?: ReactNode
  dir?: 'col' | 'row'
  className?: string
  skeleton?: boolean
}

export function TextColumn(props: PropsWithChildren<TextColumnProps>) {
  return (
    <div className={props.dir === 'col'
      ? `flex flex-col` + ` ${props.className || ''}`
      : `flex flex-wrap justify-between mt-[1.375rem] items-center` + ` ${props.className || ''}`}
    >
      <span className="text-[#999999] flex-1 min-w-[140px]">{props.label}</span>
      <div className="text-white">
        {
          props.skeleton
            ? <Skeleton className="w-60" />
            : props.value || props.children
        }
      </div>
    </div>
  )
}
