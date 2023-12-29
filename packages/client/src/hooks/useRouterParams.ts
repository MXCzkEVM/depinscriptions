import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useMount } from 'react-use'
import { useState } from 'react'
import { useWatch } from './useWatch'

export interface UseRouterParamsOptions {
  replace?: string
  persistant?: boolean
}

export function useRouterParams(key: string, options: UseRouterParamsOptions = {}) {
  const router = useRouter()

  useMount(() => {
    if (get(key))
      return
    const local = localStorage.getItem(`[${router.pathname}]params[${key}]`)
    if (options.persistant && local) {
      const path = location.search
        ? `${router.asPath}&${key}=${local}`
        : `${router.asPath}?${key}=${local}`
      router.replace(path)
      return
    }
    if (options.replace)
      router.replace(options.replace)
  })

  useWatch([router.asPath], () => {
    if (options.persistant)
      localStorage.setItem(`[${router.pathname}]params[${key}]`, get(key))
  })

  return get(key)
}

function get(key: string) {
  const params = new URLSearchParams(location.search)
  return params.get(key) || ''
}
