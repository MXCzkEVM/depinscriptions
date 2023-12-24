import type { SendTransactionArgs, SendTransactionResult } from '@wagmi/core'
import { useState } from 'react'
import { useAccount, usePrepareSendTransaction, useSendTransaction } from 'wagmi'
import { hexlify, toUtf8Bytes } from 'ethers/lib/utils.js'

export interface UseSendSatsTransactionOptions {
  from?: string
  to?: string
  data?: Record<string, any>
  onSuccess?: (data: { hash: string, json: string }) => void
  onError?: (error: Error, variables?: SendTransactionArgs, context?: unknown) => void
  automatic?: boolean
}

export function prepareSatsJson(data?: Record<string, any>) {
  return hexlify(toUtf8Bytes(JSON.stringify(data || {})))
}

export function useSendSatsTransaction(options: UseSendSatsTransactionOptions = {}) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const { config, isLoading: isConfigLoading, isFetched: isConfigFetched } = usePrepareSendTransaction({
    request: {
      data: prepareSatsJson(options.data),
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
      json: JSON.stringify(options.data || {}),
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
    config,
    isConfigLoading,
    isConfigFetched,
  }
}
