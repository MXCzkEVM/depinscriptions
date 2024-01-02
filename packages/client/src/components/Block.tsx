import { PropsWithChildren, ReactNode } from 'react'

export interface BlockProps extends PropsWithChildren {
  footer?: ReactNode
  onClick?: any
}

function Block(props: BlockProps) {
  return (
    <div onClick={props.onClick} className="flex rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col hover:border-purple-500 cursor-pointer overflow-hidden hover">
      <div className="p-4 overflow-x-hidden overflow-y-auto flex-1 bg-[rgb(39,42,48)]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        {props.children}
      </div>
      <div className="p-4 bg-[rgb(48,52,61)]">
        {props.footer}
      </div>
    </div>
  )
}

export default Block
