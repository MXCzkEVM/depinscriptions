import { PropsWithChildren, ReactNode, useEffect, useRef } from 'react'
import { useAsyncFn, useMount } from 'react-use'
import { delay } from '@hairy/utils'
import { useMittOn } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

interface InfiniteScrollProps extends PropsWithChildren {
  next: () => Promise<void>
  loader?: ReactNode
  loaded?: boolean
}
function InfiniteScroll(props: InfiniteScrollProps) {
  const [state, next] = useAsyncFn(props.next, [props.next])
  const locked = useRef(false)

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
    if (state.loading || locked.current || props.loaded)
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

  useMount(loadToScroll)
  useEffect(() => {
    loadToScroll()
  }, [props.next])

  return (
    <>
      {props.children}
      {state.loading && props.loader}
    </>
  )
}

export default InfiniteScroll
