import { thousandBitSeparator } from '@/utils'

export interface DecimalProps {
  value: string
}

export function Decimal(props: DecimalProps) {
  const [integer = '0', decimal = ''] = String(props.value).split('.')

  function renderSubDecimal() {
    return (
      <>
        0
        <sub>{decimal.length - 4}</sub>
        {decimal.slice(decimal.length - 4, decimal.length)}
      </>
    )
  }
  const isRenderDecimal = Number(decimal || 0) > 0

  return (
    <span>
      {thousandBitSeparator(integer)}
      {
        isRenderDecimal && (
          <>
            .
            {decimal.length > 4
              ? renderSubDecimal()
              : decimal}
          </>
        )
      }
    </span>
  )
}
