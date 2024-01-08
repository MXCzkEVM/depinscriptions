import { ReactNode } from 'react'
import classNames from 'classnames'
import { Decimal } from './Decimal'
import { BigNum, thousandBitSeparator } from '@/utils'

export interface PriceProps {
  symbol?: string
  label?: string
  value: any
  image?: ReactNode
  className?: string
  decimal?: number
}

export function Price(props: PriceProps) {
  const mappings = {
    mxc: () => <img className="mr-1 w-3 md:w-4 rounded-full overflow-hidden flex-shrink-0" src="/mxc.png" />,
    usd: () => <span className="mr-1">$</span>,
  }
  const symbol = props.symbol || ''
  const value = props.decimal ? BigNum(props.value).toFixed(props.decimal) : props.value
  return (
    <div className={classNames(['inline-flex items-center', props.className])}>
      {props.label && (
        <span className="text-[#999999] flex-1 mr-2">{props.label}</span>
      )}
      {
        value !== '-'
          ? (
            <>
              {props.image}
              {mappings[symbol]?.()}
              <Decimal value={Number.isNaN(Number(value)) ? '0' : value} />
              {symbol && !mappings[symbol] && <span className="ml-1">{symbol}</span>}
            </>
            )
          : '-'
      }
    </div>
  )
}
