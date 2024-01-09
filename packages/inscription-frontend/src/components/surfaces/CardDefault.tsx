import classNames from 'classnames'
import { PropsWithChildren, ReactNode } from 'react'

export interface CardDefaultProps extends PropsWithChildren {
  footer?: ReactNode
  className?: string
  footerClass?: string
  onClick?: any
}

function CardDefault(props: CardDefaultProps) {
  return (
    <div
      onClick={props.onClick}
      className={classNames([
        'dark:border-gray-700 dark:bg-gray-800',
        'hover:border-purple-500 overflow-hidden',
        'flex flex-col rounded-lg shadow-md',
        'text-sm sm:text-base',
        props.className,
      ])}
    >
      <div className="py-2 px-4 sm:p-4 overflow-x-hidden overflow-y-auto flex-1 bg-[rgb(39,42,48)]" style={{ background: 'rgb(22 21 21 / 20%)' }}>
        {props.children}
      </div>
      <div className={classNames(['py-2 px-4 sm:p-4 bg-[rgb(48,52,61)]', props.footerClass])}>
        {props.footer}
      </div>
    </div>
  )
}

export default CardDefault
