import Decimal from './Decimal'
import { thousandBitSeparator } from '@/utils'

export interface PriceProps {
  symbol?: string
  label?: string
  value: any
}

function Price(props: PriceProps) {
  const mappings = {
    mxc: () => <img className="mr-1 w-4 rounded-full overflow-hidden flex-shrink-0" src="/mxc.png" />,
    usd: () => <span className="mr-1">$</span>,
  }

  return (
    <div className="inline-flex items-center">
      {props.label && (
        <span className="text-[#999999] flex-1 mr-2">{props.label}</span>
      )}
      {
        props.value !== '-'
          ? (
            <>
              {mappings[props.symbol || '']?.()}
              <Decimal value={props.value} />
            </>
            )
          : '-'
      }
    </div>
  )
}

export default Price
