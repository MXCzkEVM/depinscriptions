import { ReactNode } from 'react'
import { Decimal } from './Decimal'
import { thousandBitSeparator } from '@/utils'

export interface PriceProps {
  symbol?: string
  label?: string
  value: any
  image?: ReactNode
}

export function Price(props: PriceProps) {
  const mappings = {
    mxc: () => <img className="mr-1 w-4 rounded-full overflow-hidden flex-shrink-0" src="/mxc.png" />,
    usd: () => <span className="mr-1">$</span>,
  }
  const symbol = props.symbol || ''
  return (
    <div className="inline-flex items-center">
      {props.label && (
        <span className="text-[#999999] flex-1 mr-2">{props.label}</span>
      )}
      {
        props.value !== '-'
          ? (
            <>
              {props.image}
              {mappings[symbol]?.()}
              <Decimal value={Number.isNaN(Number(props.value)) ? '0' : props.value} />
              {symbol && !mappings[symbol] && <span className="ml-1">{symbol}</span>}
            </>
            )
          : '-'
      }
    </div>
  )
}
