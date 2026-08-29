import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import type { CommonProps } from '../@types/common'
import useControllableState from '../hooks/useControllableState'
import Next from './Next'
import Pager from './Pagers'
import Prev from './Prev'
import Total from './Total'

export interface PaginationProps extends CommonProps {
  currentPage?: number
  displayTotal?: boolean
  onChange?: (pageNumber: number) => void
  pageSize?: number
  total?: number
  xl?: boolean
  customStyle?: {
    default?: string
    inactive?: string
    active?: string
    disabled?: string
  }
}

const defaultTotal = 5

const Pagination = (props: PaginationProps) => {
  const {
    className,
    currentPage = 1,
    displayTotal = false,
    onChange,
    pageSize = 1,
    total = 5,
    xl = false,
    customStyle = {
      default: '',
      inactive: '',
      active: '',
      disabled: '',
    },
  } = props

  const [paginationTotal] = useControllableState({
    prop: total,
    defaultProp: defaultTotal,
    onChange,
  })

  const [internalPageSize, setInternalPageSize] = useState(pageSize)

  const getInternalPageCount = useMemo(() => {
    if (typeof paginationTotal === 'number') {
      return Math.ceil(paginationTotal / internalPageSize)
    }
    return null
  }, [paginationTotal, internalPageSize])

  const getValidCurrentPage = (count: number | string) => {
    const value = parseInt(count as string, 10)
    const internalPageCount = getInternalPageCount
    let resetValue
    if (!internalPageCount) {
      if (isNaN(value) || value < 1) {
        resetValue = 1
      }
    } else {
      if (value < 1) {
        resetValue = 1
      }
      if (value > internalPageCount) {
        resetValue = internalPageCount
      }
    }

    if ((resetValue === undefined && isNaN(value)) || resetValue === 0) {
      resetValue = 1
    }

    return resetValue === undefined ? value : resetValue
  }

  const [internalCurrentPage, setInternalCurrentPage] = useState(
    currentPage ? getValidCurrentPage(currentPage) : 1
  )

  useEffect(() => {
    if (pageSize !== internalPageSize) {
      setInternalPageSize(pageSize)
    }

    if (currentPage !== internalCurrentPage) {
      setInternalCurrentPage(currentPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage])

  const onPaginationChange = (val: number) => {
    setInternalCurrentPage(getValidCurrentPage(val))
    onChange?.(getValidCurrentPage(val))
  }

  const onPrev = () => {
    const newPage = internalCurrentPage - 1
    setInternalCurrentPage(getValidCurrentPage(newPage))
    onChange?.(getValidCurrentPage(newPage))
  }

  const onNext = () => {
    const newPage = internalCurrentPage + 1
    setInternalCurrentPage(getValidCurrentPage(newPage))
    onChange?.(getValidCurrentPage(newPage))
  }

  const pagerClass = {
    default: classNames('pagination-pager', xl && 'pagination-pager-xl'),
    inactive: classNames('pagination-pager-inactive', customStyle?.inactive || ''),
    active: classNames('text-primary dark:bg-primary dark:text-neutral', customStyle?.active || ''),
    disabled: classNames('pagination-pager-disabled', customStyle?.disabled || ''),
  }

  const paginationClass = classNames('pagination', className)

  return (
    <div className={paginationClass}>
      {displayTotal && <Total total={total} />}
      <Prev currentPage={internalCurrentPage} pagerClass={pagerClass} onPrev={onPrev} xl={xl} />
      <Pager
        pageCount={getInternalPageCount as number}
        currentPage={internalCurrentPage}
        pagerClass={pagerClass}
        onChange={onPaginationChange}
        xl={xl}
      />
      <Next
        currentPage={internalCurrentPage}
        pageCount={getInternalPageCount as number}
        pagerClass={pagerClass}
        onNext={onNext}
        xl={xl}
      />
    </div>
  )
}

Pagination.displayName = 'Pagination'

export default Pagination
