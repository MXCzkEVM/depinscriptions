import { PropsWithChildren, ReactNode, useEffect, useRef } from 'react'
import { useAsyncFn } from 'react-use'
import { useWhenever } from '@/hooks/useWhenever'

interface InfiniteScrollProps extends PropsWithChildren {
  next: () => Promise<void>
  loader?: ReactNode
  loaded?: boolean
}
function InfiniteScroll(props: InfiniteScrollProps) {
  const [state, next] = useAsyncFn(props.next, [props.next])
  const locked = useRef(false)

  useEffect(() => {
    if (props.loaded)
      document.removeEventListener('scroll', onScroll)
    else
      document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [props.loaded])

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

  return (
    <>
      {props.children}
      {state.loading && props.loader}
    </>
  )
}

export default InfiniteScroll
