import type {
  DataListConfig,
  ColumnConfig,
  FilterConfig,
  ActionButton,
  BaseListItem,
} from '../types'

export class DataListConfigBuilder<T extends BaseListItem> {
  private config: Partial<DataListConfig<T>> = {}

  constructor(title: string) {
    this.config.title = title
  }

  // Колонки
  addColumn(column: ColumnConfig<T>): this {
    if (!this.config.columns) {
      this.config.columns = []
    }
    this.config.columns.push(column)
    return this
  }

  addTextColumn(
    key: string,
    title: string,
    dataIndex: keyof T,
    options?: Partial<ColumnConfig<T>>
  ): this {
    return this.addColumn({
      key,
      title,
      dataIndex,
      ...options,
    })
  }

  addSortableColumn(
    key: string,
    title: string,
    dataIndex: keyof T,
    options?: Partial<ColumnConfig<T>>
  ): this {
    return this.addColumn({
      key,
      title,
      dataIndex,
      sortable: true,
      ...options,
    })
  }

  addCustomColumn(
    key: string,
    title: string,
    dataIndex: keyof T,
    render: ColumnConfig<T>['render'],
    options?: Partial<ColumnConfig<T>>
  ): this {
    return this.addColumn({
      key,
      title,
      dataIndex,
      render,
      ...options,
    })
  }

  // Фільтри
  addFilter(filter: FilterConfig): this {
    if (!this.config.filters) {
      this.config.filters = []
    }

    // Просто додаємо до масиву
    this.config.filters.push(filter)

    return this
  }

  setFilters(filters: FilterConfig[]): this {
    this.config.filters = filters
    return this
  }

  addSelectFilter(
    key: string,
    label: string,
    options: { label: string; value: any }[],
    placeholder?: string
  ): this {
    return this.addFilter({
      key,
      label,
      type: 'select',
      options,
      placeholder,
    })
  }

  addInputFilter(key: string, label: string, placeholder?: string): this {
    return this.addFilter({
      key,
      label,
      type: 'input',
      placeholder,
    })
  }

  addCheckboxFilter(key: string, label: string): this {
    return this.addFilter({
      key,
      label,
      type: 'checkbox',
    })
  }

  addRangeFilter(key: string, label: string): this {
    return this.addFilter({
      key,
      label,
      type: 'range',
    })
  }

  // Дії
  addAction(action: ActionButton): this {
    if (!this.config.actions) {
      this.config.actions = []
    }
    this.config.actions.push(action)
    return this
  }

  addCreateAction(label: string, href: string, icon?: React.ReactNode): this {
    return this.addAction({
      key: 'create',
      label,
      variant: 'solid',
      href,
      icon,
    })
  }

  addEditAction(label: string, onClick: () => void, icon?: React.ReactNode): this {
    return this.addAction({
      key: 'edit',
      label,
      onClick,
      icon,
      showWhen: selected => selected.length === 1,
    })
  }

  addDeleteAction(label: string, onClick: () => void, icon?: React.ReactNode): this {
    return this.addAction({
      key: 'delete',
      label,
      onClick,
      icon,
      showWhen: selected => selected.length > 0,
    })
  }

  // API
  setApi(endpoint: string, method: 'GET' | 'POST' = 'GET', params?: Record<string, any>): this {
    this.config.api = {
      endpoint,
      method,
      params,
    }
    return this
  }

  // Роути
  setRoutes(routes: { edit?: string; delete?: string; view?: string; bulkDelete?: string }): this {
    this.config.routes = routes
    return this
  }

  // Пошук
  enableSearch(placeholder?: string): this {
    this.config.search = {
      enabled: true,
      placeholder,
    }
    return this
  }

  // Пагінація
  setPagination(
    pageSize: number,
    options?: {
      pageSizeOptions?: number[]
      showSizeChanger?: boolean
      showQuickJumper?: boolean
      showTotal?: boolean
    }
  ): this {
    this.config.pagination = {
      pageSize,
      ...options,
    }
    return this
  }

  // Вибір
  enableSelection(): this {
    this.config.selection = {
      enabled: true,
    }
    return this
  }

  // Експорт
  enableExport(filename?: string, dataTransform?: (data: BaseListItem[]) => any[]): this {
    this.config.export = {
      enabled: true,
      filename,
      dataTransform,
    }
    return this
  }

  // Побудова конфігурації
  build(): DataListConfig<T> {
    if (!this.config.columns) {
      throw new Error('At least one column must be defined')
    }
    if (!this.config.api) {
      throw new Error('API configuration is required')
    }

    return this.config as DataListConfig<T>
  }
}

// Зручні функції для створення типових конфігурацій
export function createBasicListConfig<T extends BaseListItem>(
  title: string,
  endpoint: string
): DataListConfig<T> {
  return new DataListConfigBuilder<T>(title)
    .setApi(endpoint)
    .enableSearch()
    .setPagination(10)
    .enableSelection()
    .enableExport()
    .build()
}

export function createAdvancedListConfig<T extends BaseListItem>(
  title: string,
  endpoint: string,
  columns: ColumnConfig<T>[],
  options?: {
    filters?: FilterConfig[]
    actions?: ActionButton[]
    pageSize?: number
    enableExport?: boolean
    enableSelection?: boolean
  }
): DataListConfig<T> {
  const builder = new DataListConfigBuilder<T>(title)
    .setApi(endpoint)
    .enableSearch()
    .setPagination(options?.pageSize || 20, {
      pageSizeOptions: [10, 20, 50, 100],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: true,
    })

  // Додаємо колонки
  columns.forEach(column => builder.addColumn(column))

  // Додаємо фільтри
  if (options?.filters) {
    options.filters.forEach(filter => builder.addFilter(filter))
  }

  // Додаємо дії
  if (options?.actions) {
    options.actions.forEach(action => builder.addAction(action))
  }

  // Додаємо експорт
  if (options?.enableExport !== false) {
    builder.enableExport()
  }

  // Додаємо вибір
  if (options?.enableSelection !== false) {
    builder.enableSelection()
  }

  return builder.build()
}

// Новий метод для створення конфігурації через об'єкт
export function buildDataListConfig<T extends BaseListItem>(config: {
  title: string
  columns: ColumnConfig<T>[]
  api: {
    endpoint: string
    method?: 'GET' | 'POST'
    params?: Record<string, any>
  }
  filters?: FilterConfig[]
  actions?: ActionButton[]
  export?: {
    enabled?: boolean
    filename?: string
    dataTransform?: (data: BaseListItem[]) => any[]
  }
  pagination?: {
    pageSize?: number
    pageSizeOptions?: number[]
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: boolean
  }
  search?: {
    enabled?: boolean
    placeholder?: string
  }
  selection?: {
    enabled?: boolean
  }
  routes?: {
    edit?: string
    delete?: string
    view?: string
    bulkDelete?: string
  }
}): DataListConfig<T> {
  const builder = new DataListConfigBuilder<T>(config.title)

  // Додаємо колонки
  config.columns.forEach(column => builder.addColumn(column))

  // Налаштовуємо API
  builder.setApi(config.api.endpoint, config.api.method, config.api.params)

  // Додаємо фільтри - просто передаємо масив
  if (config.filters) {
    builder.setFilters(config.filters)
  }

  // Додаємо дії
  if (config.actions) {
    config.actions.forEach(action => builder.addAction(action))
  }

  // Налаштовуємо експорт
  if (config.export?.enabled !== false) {
    builder.enableExport(config.export?.filename, config.export?.dataTransform)
  }

  // Налаштовуємо пагінацію
  if (config.pagination) {
    builder.setPagination(config.pagination.pageSize || 10, {
      pageSizeOptions: config.pagination.pageSizeOptions,
      showSizeChanger: config.pagination.showSizeChanger,
      showQuickJumper: config.pagination.showQuickJumper,
      showTotal: config.pagination.showTotal,
    })
  }

  // Налаштовуємо пошук
  if (config.search?.enabled !== false) {
    builder.enableSearch(config.search?.placeholder)
  }

  // Налаштовуємо вибір
  if (config.selection?.enabled !== false) {
    builder.enableSelection()
  }

  // Налаштовуємо роути
  if (config.routes) {
    builder.setRoutes(config.routes)
  }

  return builder.build()
}
