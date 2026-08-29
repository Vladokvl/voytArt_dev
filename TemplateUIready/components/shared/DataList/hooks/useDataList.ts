'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { getData } from '@/services/common/ApiService'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import type { DataListState, DataListConfig, BaseListItem } from '../types'

export function useDataList<T extends BaseListItem>(config: DataListConfig<T>, initialData?: T[]) {
  const searchParams = useSearchParams()
  const { onAppendQueryParams } = useAppendQueryParams()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)
  const isFetchingRef = useRef(false)
  const currentRequestIdRef = useRef(0)

  const initialPage = Number.parseInt(searchParams.get('pageIndex') || '', 10) || 1
  const initialPageSize =
    Number.parseInt(searchParams.get('pageSize') || '', 10) || config.pagination?.pageSize || 10
  const initialSearchQuery = searchParams.get('search') || ''
  const initialSortField = searchParams.get('sortBy') || undefined
  const initialSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc' | null) || undefined

  const initialFilters: Record<string, any> = {}

  if (config.filters && config.filters.length > 0) {
    config.filters.forEach(filter => {
      const key = filter.key

      if (filter.type === 'range') {
        const min = searchParams.get(`${key}Min`)
        const max = searchParams.get(`${key}Max`)
        if (min !== null || max !== null) {
          initialFilters[key] = {
            min: min !== null ? min : undefined,
            max: max !== null ? max : undefined,
          }
        }
      } else {
        const value = searchParams.get(key)
        if (value !== null) {
          if (filter.type === 'checkbox') {
            initialFilters[key] = value === 'true'
          } else {
            initialFilters[key] = value
          }
        }
      }
    })
  }

  const initialState: DataListState<T> = {
    data: initialData || [],
    total: 0,
    currentPage: initialPage > 0 ? initialPage : 1,
    pageSize: initialPageSize > 0 ? initialPageSize : config.pagination?.pageSize || 10,
    loading: false,
    selectedItems: [],
    filters: initialFilters,
    searchQuery: initialSearchQuery,
    sortField: initialSortField || undefined,
    sortOrder: initialSortOrder,
  }

  const stateRef = useRef<DataListState<T>>(initialState)

  const [state, setState] = useState<DataListState<T>>(stateRef.current)

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Function to fetch data
  const fetchData = useCallback(async () => {
    // Check if fetch is already in progress
    if (isFetchingRef.current) {
      return
    }

    // Generate unique request ID
    const requestId = ++currentRequestIdRef.current
    isFetchingRef.current = true

    setState(prev => ({ ...prev, loading: true }))

    try {
      const currentState = stateRef.current

      // Ensure valid pagination values (backend expects page & limit >= 1, integers)
      const safePage =
        typeof currentState.currentPage === 'number' && currentState.currentPage >= 1
          ? currentState.currentPage
          : 1
      const safeLimit =
        typeof currentState.pageSize === 'number' && currentState.pageSize >= 1
          ? currentState.pageSize
          : 10

      // Improved parameter formation logic
      const params: Record<string, any> = {
        page: safePage,
        limit: safeLimit,
        ...(currentState.searchQuery && { search: currentState.searchQuery }),
        ...(currentState.sortField && {
          sort: currentState.sortField,
          sortBy: currentState.sortField,
        }),
        ...(currentState.sortOrder && {
          order: currentState.sortOrder,
          sortOrder: currentState.sortOrder,
        }),
        ...config.api.params,
      }

      // Process filters with proper parameter formation
      Object.entries(currentState.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object' && value !== null) {
            // Range filters
            if (value.min !== undefined && value.min !== null && value.min !== '') {
              params[`${key}Min`] = value.min
            }
            if (value.max !== undefined && value.max !== null && value.max !== '') {
              params[`${key}Max`] = value.max
            }
          } else {
            // Regular filters (string, number, boolean)
            params[key] = value
          }
        }
      })

      const response = await getData<any>(config.api.endpoint, params)

      // Check if this is still the current request
      if (requestId === currentRequestIdRef.current) {
        const anyResponse = response as any

        // Special handling for admin users list: data: { users: [...] }
        if (
          anyResponse &&
          anyResponse.status === 'success' &&
          anyResponse.data &&
          Array.isArray(anyResponse.data.users)
        ) {
          const rawItems = anyResponse.data.users as Record<string, unknown>[]
          const totalFromData = anyResponse.data.totalUsers
          const totalFromMeta = anyResponse.meta?.total
          const total =
            typeof totalFromData === 'number'
              ? totalFromData
              : typeof totalFromMeta === 'number'
                ? totalFromMeta
                : rawItems.length

          const normalizedData = rawItems.map(item => ({
            ...item,
            id: item.id,
            name:
              (item as { name?: string }).name ??
              (item as { fullName?: string }).fullName ??
              ((item as { firstName?: string }).firstName &&
              (item as { lastName?: string }).lastName
                ? `${(item as { firstName?: string }).firstName} ${
                    (item as { lastName?: string }).lastName
                  }`
                : undefined),
          })) as unknown as T[]

          setState(prev => ({
            ...prev,
            data: normalizedData,
            total,
            loading: false,
          }))
        } else if (
          anyResponse &&
          anyResponse.status === 'success' &&
          anyResponse.data &&
          anyResponse.meta
        ) {
          // Normalize API response with pagination metadata
          const normalizedData = (anyResponse.data as Record<string, unknown>[]).map(item => ({
            ...item,
            id: item.id,
            name: item.name ?? item.title,
          })) as unknown as T[]
          setState(prev => ({
            ...prev,
            data: normalizedData,
            total: anyResponse.meta.total ?? normalizedData.length,
            loading: false,
          }))
        } else if (anyResponse && anyResponse.status === 'success' && anyResponse.data) {
          // Handle response with data but no meta (unpaginated)
          const normalizedData = (anyResponse.data as Record<string, unknown>[]).map(item => ({
            ...item,
            id: item.id,
            name: item.name ?? item.title,
          })) as unknown as T[]
          setState(prev => ({
            ...prev,
            data: normalizedData,
            total: normalizedData.length,
            loading: false,
          }))
        } else if (anyResponse && anyResponse.data && anyResponse.meta) {
          // Handle response with data + meta but no status (e.g. careers admin API)
          const normalizedData = (anyResponse.data as Record<string, unknown>[]).map(item => ({
            ...item,
            id: item.id,
            name: item.name ?? item.title,
          })) as unknown as T[]
          const meta = anyResponse.meta as { total?: number }
          setState(prev => ({
            ...prev,
            data: normalizedData,
            total: meta.total ?? normalizedData.length,
            loading: false,
          }))
        } else if (Array.isArray(anyResponse)) {
          // Handle flat array response (no wrapper object)
          const normalizedData = anyResponse.map((item: Record<string, unknown>) => ({
            ...item,
            id: item.id,
            name: item.name ?? item.title,
          })) as unknown as T[]
          setState(prev => ({
            ...prev,
            data: normalizedData,
            total: normalizedData.length,
            loading: false,
          }))
        } else {
          // Empty state instead of mock data
          setState(prev => ({ ...prev, data: [], total: 0, loading: false }))
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Only update state if this is still the current request
      if (requestId === currentRequestIdRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          data: [],
          total: 0,
        }))
      }
    } finally {
      // Only reset fetching flag if this is still the current request
      if (requestId === currentRequestIdRef.current) {
        isFetchingRef.current = false
      }
    }
  }, [])

  // Combined useEffect for initialization and data updates
  useEffect(() => {
    // Run fetch only once on initialization
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      fetchData()
    } else {
      // Run fetch only after initialization and only if not loading
      if (!state.loading && !isFetchingRef.current) {
        fetchData()
      }
    }

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [
    state.currentPage,
    state.pageSize,
    state.filters,
    state.searchQuery,
    state.sortField,
    state.sortOrder,
  ])

  // Update search query with debounce
  const setSearchQuery = useCallback(
    (query: string) => {
      setState(prev => ({
        ...prev,
        searchQuery: query,
        currentPage: 1, // Reset to first page on search
      }))

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Set new timeout for URL update
      searchTimeoutRef.current = setTimeout(() => {
        onAppendQueryParams({
          search: query,
          pageIndex: '1',
        })
      }, 300) // 300ms debounce
    },
    [onAppendQueryParams]
  )

  // Update filters
  const setFilters = useCallback(
    (filters: Record<string, any>) => {
      setState(prev => ({
        ...prev,
        filters,
        currentPage: 1, // Reset to first page on filter change
      }))

      // Update URL with proper parameter formatting
      const urlParams: Record<string, string> = {
        pageIndex: '1',
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object' && value !== null) {
            // Range filters - add min/max as separate parameters
            if (value.min !== undefined && value.min !== null && value.min !== '') {
              urlParams[`${key}Min`] = String(value.min)
            }
            if (value.max !== undefined && value.max !== null && value.max !== '') {
              urlParams[`${key}Max`] = String(value.max)
            }
          } else {
            // Regular filters (string, number, boolean)
            urlParams[key] = String(value)
          }
        }
      })

      onAppendQueryParams(urlParams)
    },
    [onAppendQueryParams]
  )

  // Update pagination
  const setPagination = useCallback(
    (page: number, pageSize?: number) => {
      setState(prev => ({
        ...prev,
        currentPage: page,
        ...(pageSize && { pageSize }),
      }))

      // Update URL
      const urlParams: Record<string, string> = {
        pageIndex: String(page),
      }
      if (pageSize) {
        urlParams.pageSize = String(pageSize)
      }
      onAppendQueryParams(urlParams)
    },
    [onAppendQueryParams]
  )

  // Update sorting
  const setSorting = useCallback(
    (field: string, order: 'asc' | 'desc') => {
      setState(prev => ({
        ...prev,
        sortField: field,
        sortOrder: order,
        currentPage: 1, // Reset to first page on sort change
      }))

      // Update URL
      onAppendQueryParams({
        sortBy: field,
        sortOrder: order,
        pageIndex: '1',
      })
    },
    [onAppendQueryParams]
  )

  // Select items
  const setSelectedItems = useCallback((items: T[]) => {
    setState(prev => ({
      ...prev,
      selectedItems: items,
    }))
  }, [])

  // Toggle single item selection
  const toggleItemSelection = useCallback((item: T, checked: boolean) => {
    setState(prev => {
      if (checked) {
        return {
          ...prev,
          selectedItems: [...prev.selectedItems, item],
        }
      } else {
        return {
          ...prev,
          selectedItems: prev.selectedItems.filter(i => i.id !== item.id),
        }
      }
    })
  }, [])

  // Toggle all items selection
  const toggleAllItemsSelection = useCallback((checked: boolean) => {
    setState(prev => ({
      ...prev,
      selectedItems: checked ? [...prev.data] : [],
    }))
  }, [])

  // Clear selection
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: [],
    }))
  }, [])

  // Refresh data
  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    state,
    actions: {
      setSearchQuery,
      setFilters,
      setPagination,
      setSorting,
      setSelectedItems,
      toggleItemSelection,
      toggleAllItemsSelection,
      clearSelection,
      refreshData,
    },
  }
}
