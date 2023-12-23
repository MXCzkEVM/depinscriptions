import BigNumber from "bignumber.js"

export interface ThousandBitSeparatorOptions {
  integer?: boolean
  decimal?: boolean
}

export function thousandBitSeparator(target: number | string,
  unit = ',',
  options: ThousandBitSeparatorOptions = {}) {
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

export function percentage(total: string | number, count: string | number, decimal = 2) {
  if (+total === 0)
    return 0
  if (+count === 0)
    return 0
  return +new BigNumber(count || '0')
    .div(total || '0')
    .times(100)
    .toFixed(decimal, BigNumber.ROUND_DOWN)
}
