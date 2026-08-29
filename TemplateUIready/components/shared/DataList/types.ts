import { ReactNode } from 'react'

// Base type for list item
export interface BaseListItem {
  id?: string
  [key: string]: any
}

// Table column configuration
export interface ColumnConfig<T extends BaseListItem> {
  key: string
  title: string
  dataIndex: keyof T
  width?: number | string
  render?: (value: any, record: T, index: number) => ReactNode
  sortable?: boolean
  filterable?: boolean
}

// Filter configuration
export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'input' | 'date' | 'range' | 'checkbox'
  options?: { label: string; value: any }[]
  placeholder?: string
  defaultValue?: any
}

// Filters configuration with ability to hide button
export interface FiltersConfig {
  enabled?: boolean // Hides Filter button if false
  filters: FilterConfig[]
}

// Action button configuration
export interface ActionButton {
  key: string
  label: string
  variant?: 'solid' | 'default' | 'outline'
  icon?: ReactNode
  onClick?: () => void
  /**
   * URL for navigation. Supports parameter replacement:
   * - :id - replaces with item.id
   * - :orderId - replaces with item.orderId
   * - :user.name - replaces with item.user.name (nested properties)
   * - :status - replaces with item.status
   * - Any other property from the item object
   *
   * Examples:
   * - "/admin/orders/:orderId" -> "/admin/orders/ORD-001"
   * - "/admin/users/:user.email" -> "/admin/users/john@example.com"
   * - "/admin/products/:id/details" -> "/admin/products/507f1f77bcf86cd799439011/details"
   */
  href?: string
  disabled?: boolean
  showWhen?: (selectedItems: BaseListItem[]) => boolean
}

// Export configuration
export interface ExportConfig {
  enabled: boolean
  filename?: string
  format?: 'csv' | 'excel'
  dataTransform?: (data: BaseListItem[]) => any[]
}

// API configuration
export interface ApiConfig {
  endpoint: string
  method?: 'GET' | 'POST'
  params?: Record<string, any>
  headers?: Record<string, string>
}

// Pagination
export interface PaginationConfig {
  pageSize: number
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
}

// Search
export interface SearchConfig {
  enabled: boolean
  placeholder?: string
}

// Item selection
export interface SelectionConfig {
  enabled: boolean
  onSelectionChange?: (selectedItems: BaseListItem[]) => void
}

// Loading
export interface LoadingConfig {
  skeleton?: boolean
  customLoader?: ReactNode
}

// Main DataList configuration
export interface DataListConfig<T extends BaseListItem> {
  title: string
  columns: ColumnConfig<T>[]
  filters?: FilterConfig[] // Simple array of filters - if exists, show button
  actions?: ActionButton[]
  export?: ExportConfig
  api: ApiConfig
  pagination?: PaginationConfig
  search?: SearchConfig
  selection?: SelectionConfig
  loading?: LoadingConfig
  // Custom routes for actions
  routes?: {
    /**
     * Custom view route. Supports parameter replacement like ActionButton.href
     * Examples: "/admin/orders/:orderId", "/admin/users/:user.email"
     */
    view?: string
    /**
     * Custom edit route. Supports parameter replacement like ActionButton.href
     * Examples: "/admin/orders/:orderId/edit", "/admin/users/:id/settings"
     */
    edit?: string
    /**
     * Custom delete route. Supports parameter replacement like ActionButton.href
     * Examples: "/api/orders/:orderId", "/api/users/:id"
     */
    delete?: string
    /**
     * Custom bulk delete route. Usually doesn't need parameters
     * Example: "/api/orders/bulk-delete"
     */
    bulkDelete?: string
  }
}

// Component state
export interface DataListState<T extends BaseListItem> {
  data: T[]
  total: number
  currentPage: number
  pageSize: number
  loading: boolean
  selectedItems: T[]
  filters: Record<string, any>
  searchQuery: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

// Props for DataList component
export interface DataListProps<T extends BaseListItem> {
  config: DataListConfig<T>
  className?: string
  onDataChange?: (data: T[]) => void
  onSelectionChange?: (selectedItems: T[]) => void
  customRenderers?: {
    header?: (config: DataListConfig<T>) => ReactNode
    toolbar?: (config: DataListConfig<T>, state: DataListState<T>) => ReactNode
    table?: (data: T[], columns: ColumnConfig<T>[]) => ReactNode
  }
}
