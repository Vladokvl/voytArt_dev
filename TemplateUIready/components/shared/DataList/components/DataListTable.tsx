'use client'

import { ReactNode, useMemo } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import DataTable, { ExtendedColumnDef, type OnSortParam } from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import { TbPencil, TbTrash, TbEye } from 'react-icons/tb'
import type { DataListConfig, DataListState, BaseListItem, ColumnConfig } from '../types'
import { DataListEmpty } from './DataListEmpty'

interface DataListTableProps<T extends BaseListItem> {
  config: DataListConfig<T>
  state: DataListState<T>
  onSort: (field: string, order: 'asc' | 'desc') => void
  onSelectionChange: (item: T, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onPaginationChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEdit?: (item: T) => void
  onView?: (item: T) => void
  onDelete?: (item: T) => void
  onRowClick?: (item: T) => void
  customRenderer?: (data: T[], columns: ColumnConfig<T>[]) => ReactNode
}

export function DataListTable<T extends BaseListItem>({
  config,
  state,
  onSort,
  onSelectionChange,
  onSelectAll,
  onPaginationChange,
  onPageSizeChange,
  onEdit,
  onView,
  onDelete,
  onRowClick,
  customRenderer,
}: DataListTableProps<T>) {
  const t = useTranslation('common')
  if (customRenderer) {
    return <>{customRenderer(state.data, config.columns)}</>
  }

  const { data, selectedItems, loading } = state

  const handleSort = (sort: OnSortParam) => {
    onSort(sort.key as string, sort.order as 'asc' | 'desc')
  }

  const handleRowSelect = (checked: boolean, row: T) => {
    onSelectionChange(row, checked)
  }

  const handleAllRowSelect = (checked: boolean) => {
    onSelectAll(checked)
  }

  const handlePaginationChange = (page: number) => {
    onPaginationChange(page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange(pageSize)
  }

  // Convert column configuration to DataTable format
  const columns: ExtendedColumnDef<T>[] = useMemo(() => {
    const baseColumns: ExtendedColumnDef<T>[] = config.columns.map(column => ({
      header: column.title,
      accessorKey: column.dataIndex as string,
      cell: column.render
        ? props => column.render!(props.getValue(), props.row.original, props.row.index)
        : props => props.getValue(),
      sortable: column.sortable,
      size: typeof column.width === 'string' ? parseInt(column.width) || undefined : column.width,
    }))

    // Check if any actions are available
    const hasViewAction =
      onView && (config.routes?.view || config.actions?.find(action => action.key === 'view'))
    const hasEditAction =
      onEdit && (config.routes?.edit || config.actions?.find(action => action.key === 'edit'))
    const hasDeleteAction = onDelete && config.routes?.delete

    // Add actions column if any actions exist
    if (hasViewAction || hasEditAction || hasDeleteAction) {
      baseColumns.push({
        header: '',
        id: 'actions',
        size: 120,
        cell: props => {
          const item = props.row.original
          return (
            <div className="flex items-center justify-end gap-3">
              {hasViewAction && (
                <Tooltip title={t('view')}>
                  <div
                    className="text-xl cursor-pointer select-none font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    role="button"
                    onClick={event => {
                      event.stopPropagation()
                      onView!(item)
                    }}
                  >
                    <TbEye />
                  </div>
                </Tooltip>
              )}
              {hasEditAction && (
                <Tooltip title={t('edit')}>
                  <div
                    className="text-xl cursor-pointer select-none font-semibold text-gray-600 hover:text-yellow-600 transition-colors duration-200"
                    role="button"
                    onClick={event => {
                      event.stopPropagation()
                      onEdit!(item)
                    }}
                  >
                    <TbPencil />
                  </div>
                </Tooltip>
              )}
              {hasDeleteAction && (
                <Tooltip title={t('delete')}>
                  <div
                    className="text-xl cursor-pointer select-none font-semibold text-gray-600 hover:text-red-600 transition-colors duration-200"
                    role="button"
                    onClick={event => {
                      event.stopPropagation()
                      onDelete!(item)
                    }}
                  >
                    <TbTrash />
                  </div>
                </Tooltip>
              )}
            </div>
          )
        },
      })
    }

    return baseColumns
  }, [config.columns, config.routes, config.actions, onEdit, onView, onDelete, t])

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      onRowClick={onRowClick}
      selectable={config.selection?.enabled}
      onSort={handleSort}
      onCheckBoxChange={handleRowSelect}
      onIndeterminateCheckBoxChange={handleAllRowSelect}
      onPaginationChange={handlePaginationChange}
      onSelectChange={handlePageSizeChange}
      pagingData={{
        total: state.total,
        pageIndex: state.currentPage,
        pageSize: state.pageSize,
      }}
      checkboxChecked={row => selectedItems.some(item => item.id === row.id)}
      indeterminateCheckboxChecked={rows => {
        const allSelected = rows.length > 0 && selectedItems.length === rows.length
        const someSelected = selectedItems.length > 0 && selectedItems.length < rows.length
        return allSelected || someSelected
      }}
      pageSizes={config.pagination?.pageSizeOptions || [10, 20, 50, 100]}
      noData={!loading && data.length === 0}
      customNoDataIcon={
        <DataListEmpty
          hasFilters={Object.keys(state.filters).length > 0}
          hasSearch={Boolean(state.searchQuery)}
        />
      }
    />
  )
}
