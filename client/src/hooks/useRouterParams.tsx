import { useRouter } from 'next/router'

export interface UseRouterParamsOptions {
  replace?: string
}

export function useRouterParams(key: string, options: UseRouterParamsOptions = {}) {
  const router = useRouter()
  const value = router.query[key] as string

  if (!value && options.replace)
    router.replace(options.replace)

  return value
}
