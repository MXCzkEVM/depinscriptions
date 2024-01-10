import { FetchBalanceResult } from '@wagmi/core'
import { useBalance as _useBalance, useAccount, useChainId } from 'wagmi'
import { createGlobalState, useMount, useUnmount } from 'react-use'
import { useState } from 'react'
import { useWatch } from './useWatch'

const defaultValue: Omit<FetchBalanceResult, 'value'> & { value: string } = {
  decimals: 18,
  formatted: '0.00',
  symbol: '',
  value: 0 as any,
}
const useGlobalBalance = createGlobalState(defaultValue)
const instances = { count: 0 }

export function useBalance() {
  const [enabled, setEnabled] = useState(false)
  const [globalBalance, setGlobalBalance] = useGlobalBalance()
  const { address } = useAccount()
  const chainId = useChainId()

  const { data = defaultValue } = _useBalance({
    watch: true,
    address,
    chainId,
    enabled,
  })

  useMount(() => {
    setEnabled(instances.count === 0)
    instances.count++
  })
  useUnmount(() => instances.count--)
  useWatch([data, enabled], () => {
    if (enabled)
      setGlobalBalance({ ...data, value: data.value.toString() })
  })
  return globalBalance
}
