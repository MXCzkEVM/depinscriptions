import { useRouter } from "next/router"

export function useRouterQuery(key: string) {
  const router = useRouter()
  return router.query[key] as string
}