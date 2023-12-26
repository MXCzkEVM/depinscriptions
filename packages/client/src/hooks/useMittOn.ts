import { Handler } from 'mitt'
import { useEffect } from 'react'

const events: Record<string, any> = {}

export function on(type: string, handler: Function) {
  if (!(handler instanceof Function))
    throw new Error('handler type error')
  events[type] = handler
}

export function emit(type: string, params?: any) {
  events[type]?.(params)
}

export function useMittOn(type: string, handler: Handler) {
  useEffect(() => on(type, handler), [handler])
}
