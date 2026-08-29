# DataList - Універсальний компонент для списків

DataList - це універсальний компонент для відображення списків даних з підтримкою пошуку, фільтрації, сортування, пагінації та експорту.

## Особливості

- ✅ Пошук з дебаунсом
- ✅ Фільтрація (select, input, checkbox, range)
- ✅ Сортування колонок
- ✅ Пагінація з налаштуванням розміру сторінки
- ✅ Вибір елементів (одиночний та множинний)
- ✅ Експорт в CSV
- ✅ Кнопки дій
- ✅ Інтеграція з API
- ✅ Кастомні рендерери
- ✅ TypeScript підтримка

## Базове використання

```tsx
import { DataList } from '@/components/shared/DataList'
import type { DataListConfig } from '@/components/shared/DataList'

interface User {
  _id: string
  name: string
  email: string
  role: string
}

const config: DataListConfig<User> = {
  title: 'Users',
  columns: [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
    },
  ],
  api: {
    endpoint: '/api/users',
  },
  search: {
    enabled: true,
    placeholder: 'Search users...',
  },
  pagination: {
    pageSize: 10,
  },
}

export default function UsersPage() {
  return <DataList config={config} />
}
```

## Конфігурація

### DataListConfig

```tsx
interface DataListConfig<T extends BaseListItem> {
  title: string // Заголовок сторінки
  columns: ColumnConfig<T>[] // Конфігурація колонок
  filters?: FilterConfig[] // Фільтри
  actions?: ActionButton[] // Кнопки дій
  export?: ExportConfig // Налаштування експорту
  api: ApiConfig // API конфігурація
  pagination?: PaginationConfig // Пагінація
  search?: SearchConfig // Пошук
  selection?: SelectionConfig // Вибір елементів
  loading?: LoadingConfig // Налаштування завантаження
}
```

### Колонки

```tsx
interface ColumnConfig<T> {
  key: string
  title: string
  dataIndex: keyof T
  width?: number | string
  render?: (value: any, record: T, index: number) => ReactNode
  sortable?: boolean
  filterable?: boolean
}
```

### Фільтри

```tsx
interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'input' | 'date' | 'range' | 'checkbox'
  options?: { label: string; value: any }[]
  placeholder?: string
  defaultValue?: any
}
```

### Кнопки дій

```tsx
interface ActionButton {
  key: string
  label: string
  variant?: 'solid' | 'default' | 'outline'
  icon?: ReactNode
  onClick?: () => void
  href?: string
  disabled?: boolean
  showWhen?: (selectedItems: BaseListItem[]) => boolean
}
```

## Приклади

### Складний приклад з кастомними рендерерами

```tsx
import { DataList } from '@/components/shared/DataList'
import { TbPlus, TbEdit, TbTrash } from 'react-icons/tb'
import { NumericFormat } from 'react-number-format'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'

const productConfig: DataListConfig<Product> = {
  title: 'Products',
  columns: [
    {
      key: 'product',
      title: 'Product',
      dataIndex: 'name',
      render: (value, record) => (
        <div className="flex items-center">
          <Avatar size={40} src={record.mainImage?.img} />
          <div className="ml-3">
            <h6 className="mb-0">{record.name}</h6>
            <span className="text-xs text-gray-500">{record.productCode}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      sortable: true,
      render: value => (
        <NumericFormat prefix="$" value={value} decimalScale={2} thousandSeparator={true} />
      ),
    },
  ],
  filters: [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      key: 'priceRange',
      label: 'Price Range',
      type: 'range',
    },
  ],
  actions: [
    {
      key: 'add',
      label: 'Add Product',
      variant: 'solid',
      icon: <TbPlus />,
      href: '/store/products/create',
    },
    {
      key: 'edit',
      label: 'Edit Selected',
      icon: <TbEdit />,
      showWhen: selected => selected.length === 1,
      onClick: () => {
        // Логіка редагування
      },
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: <TbTrash />,
      showWhen: selected => selected.length > 0,
      onClick: () => {
        // Логіка видалення
      },
    },
  ],
  export: {
    enabled: true,
    filename: 'products.csv',
    dataTransform: data =>
      data.map(item => ({
        Name: item.name,
        Price: item.price,
        Status: item.status,
      })),
  },
  api: {
    endpoint: '/api/products',
    params: {
      include: 'category,images',
    },
  },
  pagination: {
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: true,
  },
  search: {
    enabled: true,
    placeholder: 'Search products...',
  },
  selection: {
    enabled: true,
  },
}

export default function ProductsPage() {
  return (
    <DataList
      config={productConfig}
      onSelectionChange={selected => {
        console.log('Selected products:', selected)
      }}
      onDataChange={data => {
        console.log('Data changed:', data)
      }}
    />
  )
}
```

### Кастомні рендерери

```tsx
const config: DataListConfig<User> = {
  // ... інша конфігурація
  customRenderers: {
    header: config => (
      <div className="custom-header">
        <h1>{config.title}</h1>
        <p>Custom header content</p>
      </div>
    ),
    toolbar: (config, state) => (
      <div className="custom-toolbar">
        <span>Total: {state.total}</span>
        <span>Selected: {state.selectedItems.length}</span>
      </div>
    ),
    table: (data, columns) => <div className="custom-table">{/* Кастомна таблиця */}</div>,
  },
}
```

## API Інтеграція

Компонент автоматично інтегрується з API через `ApiService`. Очікуваний формат відповіді:

```tsx
interface ApiResponse<T> {
  list: T[]
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
}
```

### Параметри запиту

Компонент автоматично додає наступні параметри до API запиту:

- `page` - номер сторінки
- `limit` - розмір сторінки
- `search` - пошуковий запит
- `sortBy` - поле для сортування
- `sortOrder` - порядок сортування
- Всі значення з фільтрів

## Міграція з існуючих компонентів

Для міграції з існуючих компонентів:

1. Створіть конфігурацію на основі існуючих колонок
2. Перенесіть логіку рендерингу в `render` функції колонок
3. Налаштуйте фільтри та дії
4. Замініть існуючий компонент на `DataList`

## Типи

Всі типи експортуються з основного модуля:

```tsx
import type {
  DataListConfig,
  DataListProps,
  BaseListItem,
  ColumnConfig,
  FilterConfig,
  ActionButton,
  ExportConfig,
  ApiConfig,
  PaginationConfig,
} from '@/components/shared/DataList'
```

## Parameter Replacement in URLs

The DataList component now supports dynamic parameter replacement in URLs for actions and routes. You can use any property from your data items to build dynamic URLs.

### Supported Parameter Formats

1. **Direct properties**: `:propertyName`
2. **Nested properties**: `:parent.child` (using dot notation)

### Examples

#### Basic Usage

```typescript
const config: DataListConfig<Order> = {
  title: 'Orders',
  columns: [...],
  actions: [
    {
      key: 'view',
      label: 'View',
      href: '/admin/orders/:orderId' // Uses item.orderId
    },
    {
      key: 'edit',
      label: 'Edit',
      href: '/admin/orders/:orderId/edit' // Uses item.orderId
    }
  ],
  routes: {
    view: '/admin/orders/:orderId/details',
    edit: '/admin/orders/:orderId/edit',
    delete: '/api/orders/:orderId'
  }
}
```

#### Nested Properties

```typescript
const config: DataListConfig<User> = {
  title: 'Users',
  columns: [...],
  actions: [
    {
      key: 'profile',
      label: 'Profile',
      href: '/admin/users/:user.profile.id' // Uses item.user.profile.id
    },
    {
      key: 'email',
      label: 'Email',
      href: 'mailto::user.email' // Uses item.user.email
    }
  ]
}
```

#### Multiple Parameters

```typescript
const config: DataListConfig<Order> = {
  title: 'Orders',
  columns: [...],
  actions: [
    {
      key: 'track',
      label: 'Track',
      href: '/admin/orders/:orderId/track/:status' // Uses item.orderId and item.status
    }
  ]
}
```

#### Complex Examples

```typescript
// For an order with data: { _id: "123", orderId: "ORD-001", status: "paid", customer: { email: "john@example.com" } }

const config: DataListConfig<Order> = {
  title: 'Orders',
  columns: [...],
  actions: [
    {
      key: 'view',
      label: 'View Order',
      href: '/admin/orders/:orderId' // -> "/admin/orders/ORD-001"
    },
    {
      key: 'email',
      label: 'Email Customer',
      href: 'mailto::customer.email' // -> "mailto:john@example.com"
    },
    {
      key: 'status',
      label: 'Status',
      href: '/admin/orders/:orderId/status/:status' // -> "/admin/orders/ORD-001/status/paid"
    }
  ],
  routes: {
    view: '/admin/orders/:orderId/details',
    edit: '/admin/orders/:orderId/edit',
    delete: '/api/orders/:orderId'
  }
}
```

### Fallback Behavior

If a parameter is not found in the item object, the original placeholder will be preserved:

```typescript
// If item doesn't have 'orderId' property
href: '/admin/orders/:orderId' // -> "/admin/orders/:orderId" (unchanged)
```

### Supported Actions

Parameter replacement works with:

1. **Action buttons** (`config.actions[].href`)
2. **View routes** (`config.routes.view`)
3. **Edit routes** (`config.routes.edit`)
4. **Delete routes** (`config.routes.delete`)

### Best Practices

1. **Use descriptive parameter names**: `:orderId` instead of `:id`
2. **Handle missing data**: Always provide fallback values in your data
3. **Test edge cases**: Ensure URLs work when properties are undefined
4. **Use nested properties carefully**: Make sure the path exists in your data structure
