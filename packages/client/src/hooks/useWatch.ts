import { useEffect } from 'react'

export type WatchCallback<T> = (value: T) => any
export function useWatch<T extends any[]>(source: T, callback: WatchCallback<T>): void
export function useWatch(source: any, callback: any) {
  useEffect(() => {
    callback(source)
  }, source)
}
