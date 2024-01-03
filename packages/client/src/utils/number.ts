import BigNumber from 'bignumber.js'

export interface ThousandBitSeparatorOptions {
  integer?: boolean
  decimal?: boolean
}

export function thousandBitSeparator(target: any = 0, unit = ',', options: ThousandBitSeparatorOptions = {}) {
  options.integer = options.integer ?? true
  options.decimal = options.decimal ?? false
  const exp = /(\d)(?=(\d{3})+$)/ig
  const replace = (v: string) => v.replace(exp, `$1${unit || ''}`)
  let [integer = '0', decimal = ''] = String(target).split('.')
  if (options.integer)
    integer = replace(integer)
  if (options.decimal)
    decimal = replace(decimal)
  return [integer, decimal].filter(Boolean).join('.')
}

export function percentage(total: string | number, count: string | number, decimal = 1) {
  if (+total === 0)
    return '0.0'
  if (+count === 0)
    return '0.0'
  const number = new BigNumber(count || '0')
    .div(total || '0')
    .times(100)
    .toFixed(decimal, BigNumber.ROUND_DOWN)
  return number as any
}

const Big = BigNumber.clone({
  DECIMAL_PLACES: 18,
})
export function BigNum(n: BigNumber.Value) {
  return new Big(n)
}
