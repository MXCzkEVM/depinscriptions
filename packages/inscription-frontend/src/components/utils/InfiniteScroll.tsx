import { PropsWithChildren, ReactNode, useEffect, useRef } from 'react'
import { useAsyncFn, useMount } from 'react-use'
import { delay } from '@hairy/utils'
import { LoadingButton } from '@mui/lab'
import { useAsyncCallback, useWhenever } from '@/hooks'

export interface InfiniteScrollProps extends PropsWithChildren {
  next: () => Promise<void>
  loader?: ReactNode
  loaded?: boolean
}

export function InfiniteScroll(props: InfiniteScrollProps) {
  const [loading, next] = useAsyncCallback(props.next)
  const locked = useRef(false)
  const loader = props.loader || defaultLoader()

  async function loadToScroll() {
    if (locked.current)
      return
    locked.current = true
    const windowHeight
    = document.documentElement.clientHeight || document.body.clientHeight
    const scrollHeight
    = document.documentElement.scrollHeight || document.body.scrollHeight
    if (windowHeight === scrollHeight) {
      await next()
      await delay(100)
      await loadToScroll()
    }
    locked.current = false
  }

  async function onScroll() {
    if (loading || locked.current || props.loaded)
      return
    const scrollTop
      = document.documentElement.scrollTop || document.body.scrollTop
    const windowHeight
      = document.documentElement.clientHeight || document.body.clientHeight
    const scrollHeight
      = document.documentElement.scrollHeight || document.body.scrollHeight
    if (Math.round(scrollTop) + windowHeight === scrollHeight)
      next()
  }

  useEffect(() => {
    if (props.loaded)
      document.removeEventListener('scroll', onScroll)
    else
      document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [props.loaded])

  useWhenever(props.next, loadToScroll)

  return (
    <>
      {props.children}
      {loading && loader}
    </>
  )
}

function defaultLoader() {
  return (
    <div className="flex justify-center py-2">
      <LoadingButton />
    </div>
  )
}
