import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useMount } from 'react-use'
import { useState } from 'react'
import { useWatch } from './useWatch'

export interface UseRouterParamsOptions {
  replace?: string
  persistant?: boolean
  default?: string | number
}

export function useRouterParams(key: string, options: UseRouterParamsOptions = {}) {
  const router = useRouter()
  const lKey = `[${router.pathname}][params][${key}]`

  useMount(() => {
    if (get(key))
      return
    const local = localStorage.getItem(lKey) || options.default
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
      localStorage.setItem(lKey, get(key))
  })

  function set(value: string) {
    if (!value)
      return
    const params = new URLSearchParams(location.search)
    params.set(key, value)
    router.replace(router.asPath, { search: stringify(params) })
  }

  return [get(key), set] as const
}

function get(key: string) {
  const params = new URLSearchParams(location.search)
  return params.get(key) || ''
}

function stringify(params: URLSearchParams) {
  let string
  for (const [k, v] of params)
    string = `${k}=${v}`
  return string
}
