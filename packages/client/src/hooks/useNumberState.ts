import { useState } from 'react'

export interface NumberStateOptions {
  min?: string | number | bigint
  max?: string | number | bigint
}

export function useNumberState(init: string, options: NumberStateOptions = {}) {
  const [value, setValue] = useState(init)
  const { max = Number.POSITIVE_INFINITY, min = 0 } = options

  function set(value: string = '0') {
    if (BigInt(value) < BigInt(min))
      return setValue(min.toString())
    if (BigInt(value) > BigInt(max))
      return setValue(max.toString())

    setValue(value)
  }

  return [value, set] as const
}
