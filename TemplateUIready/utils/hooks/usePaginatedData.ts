import { useState, useEffect, useCallback } from 'react'

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
}

export interface PaginatedResponse<T> {
  status: string
  data: T[]
  meta: PaginationMeta
}

export interface QueryParams {
  pageIndex?: string
  pageSize?: string
  sortKey?: string
  order?: 'asc' | 'desc'
  query?: string
  [key: string]: string | string[] | undefined
}

export interface UsePaginatedDataReturn<T> {
  data: T[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  success: boolean
  refetch: () => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setQuery: (query: string) => void
  setSort: (sortKey: string, order: 'asc' | 'desc') => void
  resetFilters: () => void
}

export interface UsePaginatedDataOptions {
  initialPage?: number
  initialPageSize?: number
  initialQuery?: string
  initialSortKey?: string
  initialOrder?: 'asc' | 'desc'
  autoFetch?: boolean
}

const usePaginatedData = <T>(
  fetchFunction: (params: QueryParams) => Promise<{
    list: T[]
    total: number
    meta: PaginationMeta
    success: boolean
    error?: string
  }>,
  options: UsePaginatedDataOptions = {}
): UsePaginatedDataReturn<T> => {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialQuery = '',
    initialSortKey = '',
    initialOrder = 'asc',
    autoFetch = true,
  } = options

  // State
  const [data, setData] = useState<T[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Query parameters
  const [pageIndex, setPageIndex] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [query, setQueryState] = useState(initialQuery)
  const [sortKey, setSortKey] = useState(initialSortKey)
  const [order, setOrder] = useState<'asc' | 'desc'>(initialOrder)

  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params: QueryParams = {
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString(),
        sortKey,
        order,
        query: query || undefined,
      }

      const result = await fetchFunction(params)

      if (result.success) {
        setData(result.list)
        setMeta(result.meta)
        setSuccess(true)
      } else {
        setError(result.error || 'Failed to fetch data')
        setSuccess(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, pageIndex, pageSize, sortKey, order, query])

  // Auto fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [fetchData, autoFetch])

  // Actions
  const setPage = useCallback((page: number) => {
    setPageIndex(page)
  }, [])

  const setPageSize = useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize)
    setPageIndex(1) // Reset to first page when changing page size
  }, [])

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery)
    setPageIndex(1) // Reset to first page when searching
  }, [])

  const setSort = useCallback((newSortKey: string, newOrder: 'asc' | 'desc') => {
    setSortKey(newSortKey)
    setOrder(newOrder)
    setPageIndex(1) // Reset to first page when sorting
  }, [])

  const resetFilters = useCallback(() => {
    setPageIndex(initialPage)
    setPageSizeState(initialPageSize)
    setQueryState(initialQuery)
    setSortKey(initialSortKey)
    setOrder(initialOrder)
  }, [initialPage, initialPageSize, initialQuery, initialSortKey, initialOrder])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    meta,
    loading,
    error,
    success,
    refetch,
    setPage,
    setPageSize,
    setQuery,
    setSort,
    resetFilters,
  }
}

export default usePaginatedData
