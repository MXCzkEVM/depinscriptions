export function cover(value?: string, mode: [number, number, number] = [6, 3, 4], symbol = '*') {
  if (!value)
    return ''
  return value.slice(0, mode[0]) + symbol.repeat(mode[1]) + value.slice(-mode[2])
}
