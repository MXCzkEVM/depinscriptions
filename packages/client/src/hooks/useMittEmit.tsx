import { emit as _emit } from './useMittOn'

export function useMittEmit(type: string) {
  function emit(event?: any) {
    _emit(type, event)
  }
  return emit
}
