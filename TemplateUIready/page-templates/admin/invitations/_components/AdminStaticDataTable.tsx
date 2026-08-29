'use client'

import { useCallback, useMemo, useState } from 'react'
import DataTable, { type ExtendedColumnDef } from '@/components/shared/DataTable'
import { DataListEmpty } from '@/components/shared/DataList/components/DataListEmpty'

type AdminStaticDataTableProps<T> = {
  data: T[]
  columns: ExtendedColumnDef<T>[]
  pageSize?: number
  onRowClick?: (row: T) => void
}

export default function AdminStaticDataTable<T>({
  data,
  columns,
  pageSize: initialPageSize = 10,
  onRowClick,
}: AdminStaticDataTableProps<T>) {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const pageData = useMemo(() => {
    const start = (pageIndex - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, pageIndex, pageSize])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPageIndex(1)
  }, [])

  return (
    <DataTable
      data={pageData}
      columns={columns}
      pagingData={{
        total: data.length,
        pageIndex,
        pageSize,
      }}
      onPaginationChange={setPageIndex}
      onSelectChange={handlePageSizeChange}
      onRowClick={onRowClick}
      pageSizes={[10, 20, 50]}
      noData={data.length === 0}
      customNoDataIcon={
        <DataListEmpty hasFilters={false} hasSearch={false} />
      }
    />
  )
}
