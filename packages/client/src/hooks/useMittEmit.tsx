import { Emitter, Handler } from 'mitt'
import { useEffect } from 'react'
import { useMitt } from 'react-mitt'
import { useMount } from 'react-use'

export function useMittEmit(type: string) {
  const { emitter } = useMitt()
  function emit(event?: any) {
    emitter.emit(type, event)
  }
  return emit
}
