

export function cover(value?: string, mode: [number, number, number] = [6, 3, 4], symbol = '*') {
  if (!value)
    return ''
  return value.slice(0, mode[0]) + symbol.repeat(mode[1]) + value.slice(-mode[2])
}

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

export const noop = ():any => {}