import { Emitter, Handler } from 'mitt'
import { useEffect } from 'react'
import { useMitt } from 'react-mitt'
import { useMount } from 'react-use'

export function useMittOn(type: string, handler: Handler) {
  const { emitter } = useMitt()
  useMount(() => emitter.on(type, handler))
}
