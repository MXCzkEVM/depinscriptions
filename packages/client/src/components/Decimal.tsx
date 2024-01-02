import { thousandBitSeparator } from '@/utils'

export interface DecimalProps {
  value: string
}

function Decimal(props: DecimalProps) {
  const [integer = '0', decimal = ''] = String(props.value).split('.')

  return (
    <span>
      {thousandBitSeparator(integer)}
      {decimal && '.'}
      {decimal.length > 4
        ? (
          <>
            0
            <sub>{decimal.length - 4}</sub>
            {decimal.slice(decimal.length - 4, decimal.length)}
          </>
          )
        : decimal}
    </span>
  )
}

export default Decimal
