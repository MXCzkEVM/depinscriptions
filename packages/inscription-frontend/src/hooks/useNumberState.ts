import { useState } from 'react'
import { BigNum } from '@/utils'

export interface NumberStateOptions {
  min?: string | number | bigint
  max?: string | number | bigint
}

export function useNumberState(init: string, options: NumberStateOptions = {}) {
  const [value, setValue] = useState(init)
  const { max = Number.POSITIVE_INFINITY, min = 0 } = options

  function set(value: string = '0') {
    if (Number.isNaN(Number(value)))
      return
    if (min === 0 && value === '-')
      return

    if (BigNum(value).lt(min.toString()))
      return setValue(min.toString())

    if (max !== Number.POSITIVE_INFINITY && BigNum(value).gt(max.toString()))
      return setValue(max.toString())

    setValue(value)
  }

  return [value, set] as const
}
