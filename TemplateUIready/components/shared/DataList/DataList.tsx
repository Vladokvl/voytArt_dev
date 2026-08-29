'use client'

import useTranslation from '@/utils/hooks/useTranslation'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Container from '@/components/shared/Container'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { sendData } from '@/services/common/ApiService'
import { useCallback, useEffect, useState } from 'react'
import { TbChecks } from 'react-icons/tb'
import { DataListTable } from './components/DataListTable'
import { DataListToolbar } from './components/DataListToolbar'
import { useDataList } from './hooks/useDataList'
import type { BaseListItem, DataListProps } from './types'

// Utility function to replace parameters in URL
const replaceUrlParams = (url: string, item: any): string => {
  return url.replace(/:(\w+)/g, (match, paramName) => {
    if (paramName === 'id') {
      return item.id ?? match
    }

    // Handle nested properties with dot notation (e.g., :user.name)
    if (paramName.includes('.')) {
      const parts = paramName.split('.')
      let value = item
      for (const part of parts) {
        value = value?.[part]
        if (value === undefined) break
      }
      return value || match
    }
    // Handle direct properties
    return item[paramName] || match
  })
}

export function DataList<T extends BaseListItem>({
  config,
  className,
  onDataChange,
  onSelectionChange,
  customRenderers,
}: DataListProps<T>) {
  const t = useTranslation('common')
  const { state, actions } = useDataList(config)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [singleDeleteConfirmationOpen, setSingleDeleteConfirmationOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)

  // Call callbacks when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(state.data)
    }
  }, [state.data, onDataChange])

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(state.selectedItems)
    }
  }, [state.selectedItems, onSelectionChange])

  // Handle editing
  const handleEdit = useCallback(
    (item: T) => {
      const editAction = config.actions?.find(action => action.key === 'edit')
      if (editAction?.onClick) {
        editAction.onClick()
      } else if (editAction?.href) {
        // Replace :id with actual ID
        const href = replaceUrlParams(editAction.href, item)
        window.location.href = href
      } else if (config.routes?.edit) {
        // Use custom route from config
        const href = replaceUrlParams(config.routes.edit, item)
        window.location.href = href
      } else {
        // Standard edit route
        window.location.href = `/admin/${config.title.toLowerCase()}/details/${item.id}`
      }
    },
    [config.actions, config.routes, config.title]
  )

  // Handle viewing
  const handleView = useCallback(
    (item: T) => {
      const viewAction = config.actions?.find(action => action.key === 'view')
      if (viewAction?.onClick) {
        viewAction.onClick()
      } else if (viewAction?.href) {
        // Replace :id with actual ID
        const href = replaceUrlParams(viewAction.href, item)
        window.location.href = href
      } else if (config.routes?.view) {
        // Use custom view route from config
        const href = replaceUrlParams(config.routes.view, item)
        window.location.href = href
      } else {
        // Standard view route
        window.location.href = `/admin/${config.title.toLowerCase()}/details/${item.id}`
      }
    },
    [config.actions, config.routes, config.title]
  )

  // Handle single item deletion
  const handleDelete = useCallback(
    (item: T) => {
      const deleteAction = config.actions?.find(action => action.key === 'delete')
      if (deleteAction?.onClick) {
        deleteAction.onClick()
      } else if (config.routes?.delete) {
        // Standard deletion logic via API
        setItemToDelete(item)
        setSingleDeleteConfirmationOpen(true)
      }
    },
    [config.actions, config.routes]
  )

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmationOpen(false)
    setSingleDeleteConfirmationOpen(false)
    setItemToDelete(null)
  }, [])

  const handleConfirmDelete = useCallback(
    async (itemsToDelete: T[] = state.selectedItems) => {
      if (itemsToDelete.length === 0) return

      setIsDeleting(true)

      try {
        const itemIds = itemsToDelete.map(item => item.id)

        // Determine endpoint for deletion
        let deleteEndpoint: string
        let requestData: any

        if (itemsToDelete.length === 1) {
          // Single item deletion
          if (config.routes?.delete) {
            deleteEndpoint = replaceUrlParams(config.routes.delete, itemsToDelete[0])
            // If delete URL has no path param, backend may expect id in body (e.g. POST /posts/delete)
            requestData = /:\w+/.test(config.routes.delete) ? {} : { id: itemIds[0] }
          } else {
            deleteEndpoint = `${config.api.endpoint}/${itemIds[0]}`
            requestData = {}
          }
        } else {
          // Bulk deletion
          if (config.routes?.bulkDelete) {
            deleteEndpoint = config.routes.bulkDelete
          } else if (config.api.endpoint.includes('bulk-delete')) {
            deleteEndpoint = config.api.endpoint
          } else {
            deleteEndpoint = `${config.api.endpoint}/bulk-delete`
          }
          requestData = { ids: itemIds }
        }

        await sendData(
          deleteEndpoint,
          'delete',
          requestData,
          // onSuccess callback
          () => {
            // Update data
            actions.refreshData()
            // Clear selection
            actions.clearSelection()
            setDeleteConfirmationOpen(false)
            setSingleDeleteConfirmationOpen(false)
            setItemToDelete(null)
            setIsDeleting(false)
          },
          // onError callback
          (error: any) => {
            console.error('Error deleting items:', error)
            toast.push(<Notification type="danger">{t('errorDeletingItem')}</Notification>, {
              placement: 'top-center',
            })
            setIsDeleting(false)
          }
        )
      } catch (error) {
        console.error('Error deleting items:', error)
        setIsDeleting(false)
      }
    },
    [state.selectedItems, config.routes, config.api.endpoint, actions]
  )

  // Memoize page size change handler
  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      actions.setPagination(1, pageSize)
    },
    [actions]
  )

  // Memoize single item deletion confirmation handler
  const handleConfirmSingleDelete = useCallback(() => {
    if (itemToDelete) {
      handleConfirmDelete([itemToDelete])
    }
  }, [itemToDelete, handleConfirmDelete])

  return (
    <Container className={className}>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          {/* Toolbar */}
          <DataListToolbar
            config={config}
            state={state}
            onSearchChange={actions.setSearchQuery}
            onFilterChange={actions.setFilters}
            customRenderer={customRenderers?.toolbar}
          />

          {/* Table */}
          <DataListTable
            config={config}
            state={state}
            onSort={actions.setSorting}
            onSelectionChange={actions.toggleItemSelection}
            onSelectAll={actions.toggleAllItemsSelection}
            onPaginationChange={actions.setPagination}
            onPageSizeChange={handlePageSizeChange}
            onEdit={
              config.routes?.edit || config.actions?.find(action => action.key === 'edit')
                ? handleEdit
                : undefined
            }
            onView={
              config.routes?.view || config.actions?.find(action => action.key === 'view')
                ? handleView
                : undefined
            }
            onDelete={config.routes?.delete ? handleDelete : undefined}
            onRowClick={
              config.routes?.view || config.actions?.find(action => action.key === 'view')
                ? handleView
                : undefined
            }
            customRenderer={customRenderers?.table}
          />
        </div>
      </AdaptiveCard>

      {/* Selected items bar */}
      {state.selectedItems.length > 0 && (
        <StickyFooter
          className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
          stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
          defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <span>
                {state.selectedItems.length > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-lg text-primary">
                      <TbChecks />
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <span className="heading-text">
                        {state.selectedItems.length} {t('items')}
                      </span>
                      <span>{t('selected')}</span>
                    </span>
                  </span>
                )}
              </span>

              <div className="flex items-center">
                <Button
                  size="sm"
                  className="ltr:mr-3 rtl:ml-3"
                  type="button"
                  customColorClass={() =>
                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                  }
                  onClick={() => handleConfirmDelete(state.selectedItems)}
                  disabled={isDeleting}
                >
                  {isDeleting ? t('deleting') : t('delete')}
                </Button>
              </div>
            </div>
          </div>
        </StickyFooter>
      )}

      {/* Bulk deletion confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmationOpen}
        type="danger"
        title={t('removeItems')}
        onClose={handleCancelDelete}
        onRequestClose={handleCancelDelete}
        onCancel={handleCancelDelete}
        onConfirm={() => handleConfirmDelete()}
      >
        <p>{t('removeItemsConfirm', { count: state.selectedItems.length })}</p>
      </ConfirmDialog>

      {/* Single item deletion confirmation dialog */}
      <ConfirmDialog
        isOpen={singleDeleteConfirmationOpen}
        type="danger"
        title={t('removeItem')}
        onClose={handleCancelDelete}
        onRequestClose={handleCancelDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmSingleDelete}
      >
        <p>{t('removeSingleItemConfirm')}</p>
      </ConfirmDialog>
    </Container>
  )
}

export default DataList
