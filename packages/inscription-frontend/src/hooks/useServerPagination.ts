import { useState } from 'react'

export interface PaginationModel {
  limit: number
  page: number
}

export interface PaginationResolved<T> {
  total: number
  data: T
}

export interface UseServerPaginationOptions<T> {
  resolve: (model: Omit<PaginationModel, 'total'>) => PaginationResolved<T> | Promise<PaginationResolved<T>>
  limit?: number
  page?: number
  total?: number
}

export interface Pagination {
  pages: number
  page: number
  limit: number
  total: number
  first: boolean
  last: boolean
}

export function useServerPagination<T>(options: UseServerPaginationOptions<T>) {
  const [value, setValue] = useState<T>([] as any)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(options.limit || 15)
  const [loading, setLoading] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [error, setError] = useState<Error>()

  async function load(modal: Partial<PaginationModel>) {
    const _limit = modal.limit || limit
    const _page
    = !(typeof modal.limit !== 'undefined' && modal.limit !== limit)
      ? modal.page || page
      : 1

    try {
      setLoading(true)
      const response = await options.resolve({
        page: _page,
        limit: _limit,
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

  async function next() {
    try {
      setReloading(true)
      await load({ page: page + 1, limit })
      setReloading(false)
    }
    catch (error) {
      setReloading(false)
    }
  }
  async function prev() {
    await load({ page: page - 1, limit })
  }
  async function reload() {
    await load({ page: 1, limit })
  }

  const pages = Math.ceil(total / limit)
  const first = page === 1
  const last = page === pages

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
    reloading,
  }

  const controls = {
    next,
    prev,
    load,
    reload,
  }
  return [state, controls] as const
}
