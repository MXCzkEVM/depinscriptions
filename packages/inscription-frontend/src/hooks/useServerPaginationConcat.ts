import { useRef, useState } from 'react'
import { PaginationModel, UseServerPaginationOptions } from './useServerPagination'

export interface PaginationConcatModel extends PaginationModel {
  reload: boolean
}

export function useServerPaginationConcat<T extends Array<unknown>>(options: UseServerPaginationOptions<T>) {
  const pageRef = useRef(options.page || 1)
  const valueRef = useRef<T>([] as any)
  const [total, setTotal] = useState(options.total || 0)
  const [limit, setLimit] = useState(options.limit || 15)
  const [loading, setLoading] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [error, setError] = useState<Error>()
  const [loaded, setLoaded] = useState(false)

  async function load(model: Partial<PaginationModel & { reload: boolean }>) {
    const _limit = model.limit || limit
    const _reload = model.reload || false
    const _page
      = !(typeof model.limit !== 'undefined' && model.limit !== limit)
        ? model.page || pageRef.current
        : 1

    if (loaded && _reload === false)
      return
    setLoading(true)
    try {
      const response = await options.resolve({
        page: _page,
        limit: _limit,
      })
      const data: any = _page === 1
        ? [...response.data]
        : [...valueRef.current, ...response.data]

      valueRef.current = data
      pageRef.current = _page
      setTotal(response.total)
      setLoaded(data.length === response.total)
      setLimit(_limit)
      setLoading(false)
      setError(undefined)
    }
    catch (error: any) {
      setLoading(false)
      setError(error)
      throw error
    }
  }

  async function reload() {
    try {
      setReloading(true)
      await load({ page: 1, reload: true })
      setReloading(false)
    }
    catch (error) {
      setReloading(false)
    }
  }

  async function next() {
    await load({ page: pageRef.current + 1, limit })
  }

  const pages = Math.ceil(total / limit)
  const first = pageRef.current === 1
  const last = pageRef.current === pages

  const pagination = {
    page: pageRef.current,
    pages,
    limit,
    total,
    first,
    last,
  }

  const state = {
    value: valueRef.current,
    loaded,
    pagination,
    loading,
    error,
    reloading,
  }

  const controls = {
    next,
    load,
    reload,
  }

  return [state, controls] as const
}
