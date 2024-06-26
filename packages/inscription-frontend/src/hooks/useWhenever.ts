import { WatchCallback, useWatch } from './useWatch'

export function useWhenever<T>(source: T, callback: WatchCallback<T>): void
export function useWhenever<T>(source: any, cb: WatchCallback<T>) {
  useWatch([source], () => {
    if (source)
      cb(source)
  })
}
