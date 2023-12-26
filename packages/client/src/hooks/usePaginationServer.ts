import { useState } from 'react'

export interface PaginationModal {
  limit: number
  page: number
  total: number
}

export interface PaginationResolved<T> {
  total: number
  data: T
}

export interface UsePaginationServerOptions<T> {
  resolve: (model: PaginationModal) => PaginationResolved<T> | Promise<PaginationResolved<T>>
  limit?: number
  page?: number
  total?: number
}

export function usePaginationServer<T>(options: UsePaginationServerOptions<T>) {
  const [value, setValue] = useState<T>([] as any)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(options.limit || 15)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  async function load(modal: Partial<PaginationModal>) {
    const _limit = modal.limit || limit
    const _total = modal.total || total
    const _page
    = !(typeof modal.limit !== 'undefined' && modal.limit !== limit)
      ? modal.page || page
      : 1

    setLoading(true)
    try {
      const response = await options.resolve({
        page: _page,
        limit: _limit,
        total: _total,
      })
      setValue(response.data)
      setTotal(response.total)
      setPage(_page)
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
  const pages = Math.ceil(total / limit)
  const first = page === 1
  const last = page === pages

  async function next() {
    await load({ page: page + 1, limit, total })
  }
  async function prev() {
    await load({ page: page - 1, limit, total })
  }
  async function reload() {
    await load({ page: 1, limit, total })
  }

  const pagination = {
    pages,
    page,
    limit,
    total,
    first,
    last,
  }

  const state = {
    pagination,
    value,
    loading,
    error,
  }

  const controls = {
    next,
    prev,
    load,
    reload,
  }
  return [state, controls] as const
}
