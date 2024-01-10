import { thousandBitSeparator } from '@/utils'

export interface DecimalProps {
  value: string
}

export function Decimal(props: DecimalProps) {
  const [integer = '0', decimal = ''] = String(props.value).split('.')

  function renderSubDecimal() {
    const fastZeroEndIndex = findZeroIndex(decimal)
    return (
      <>
        0
        <sub>{fastZeroEndIndex}</sub>
        {decimal.slice(fastZeroEndIndex + 1, fastZeroEndIndex + 5)}
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
            {decimal.startsWith('0000')
              ? renderSubDecimal()
              : decimal.substring(0, 4)}
          </>
        )
      }
    </span>
  )
}

function findZeroIndex(n: string) {
  let lastIndex = -1
  for (let i = 0; i < n.length; i++) {
    if (n[i] === '0')
      lastIndex = i
  }
  return lastIndex
}
