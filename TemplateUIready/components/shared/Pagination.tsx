import React from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { getServerTranslation } from '@/i18n/server'

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

export interface PaginationProps {
  meta: PaginationMeta | null
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showTotal?: boolean
  className?: string
}

const Pagination: React.FC<PaginationProps> = async ({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showTotal = true,
  className = '',
}) => {
  const t = await getServerTranslation('common')
  if (!meta) {
    return null
  }

  const { total, page, limit, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = meta

  const handlePageSizeChange = (selectedOption: any) => {
    if (selectedOption && selectedOption.value) {
      onPageSizeChange(parseInt(selectedOption.value))
    }
  }

  const pageSizeOptionsData = pageSizeOptions.map(option => ({
    value: option.toString(),
    label: option.toString(),
  }))

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          size="sm"
          variant="default"
          onClick={() => onPageChange(1)}
          className="min-w-[40px]"
        >
          1
        </Button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          size="sm"
          variant={i === page ? 'solid' : 'default'}
          onClick={() => onPageChange(i)}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
      pages.push(
        <Button
          key={totalPages}
          size="sm"
          variant="default"
          onClick={() => onPageChange(totalPages)}
          className="min-w-[40px]"
        >
          {totalPages}
        </Button>
      )
    }

    return pages
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Left side - Total and page size selector */}
      <div className="flex items-center space-x-4">
        {showTotal && (
          <div className="text-sm text-gray-600">
            {t('showingResults', {
              from: (page - 1) * limit + 1,
              to: Math.min(page * limit, total),
              total,
            })}
          </div>
        )}

        {showPageSizeSelector && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{t('show')}:</span>
            <Select
              size="sm"
              value={pageSizeOptionsData.find(option => option.value === limit.toString())}
              onChange={handlePageSizeChange}
              options={pageSizeOptionsData}
              className="w-20"
            />
            <span className="text-sm text-gray-600">{t('perPage')}</span>
          </div>
        )}
      </div>

      {/* Right side - Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <Button
          size="sm"
          variant="default"
          onClick={() => onPageChange(prevPage || page - 1)}
          disabled={!hasPrevPage}
          className="min-w-[40px]"
        >
          ←
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        {/* Next button */}
        <Button
          size="sm"
          variant="default"
          onClick={() => onPageChange(nextPage || page + 1)}
          disabled={!hasNextPage}
          className="min-w-[40px]"
        >
          →
        </Button>
      </div>
    </div>
  )
}

export default Pagination
