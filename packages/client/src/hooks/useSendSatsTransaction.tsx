import type { SendTransactionArgs, SendTransactionResult } from '@wagmi/core'
import { useMemo, useState } from 'react'
import { useAccount, usePrepareSendTransaction, useSendTransaction } from 'wagmi'
import { toUtf8 } from '@cosmjs/encoding'
import { stringify } from '@/utils'
export interface UseSendSatsTransactionOptions {
  from?: string
  to?: string
  data?: Record<string, any>
  onSuccess?: (data: { hash: string, json: string }) => void
  onError?: (error: Error, variables?: SendTransactionArgs, context?: unknown) => void
}
export function useSendSatsTransaction(options: UseSendSatsTransactionOptions = {}) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const json = useMemo(() => stringify(options.data || {}), [options.data])
  
  const { config } = usePrepareSendTransaction({
    request: {
      data: options.data ? toUtf8(json) : undefined,
      from: options.from || address,
      to: options.to || address || '',
    },
  })
  const { sendTransaction } = useSendTransaction({
    ...config,
    onSuccess: onResolvedData,
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context)
      setIsLoading(false)
    },
  })

  async function onResolvedData(data: SendTransactionResult) {
    const receipt = await data.wait().finally(() => setIsLoading(false))
    if (receipt.status !== 1) {
      options.onError?.(new Error(receipt.logsBloom))
      return
    }
    options.onSuccess?.({
      hash: receipt.transactionHash,
      json,
    })
  }

  const _sendTransaction: typeof sendTransaction = sendTransaction
    ? (...args: any) => {
        setIsLoading(true)
        sendTransaction(...args)
      }
    : undefined

  return {
    sendTransaction: _sendTransaction,
    isLoading,
    address,
  }
}
