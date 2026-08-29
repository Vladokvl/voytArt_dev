import { ReactNode } from 'react'

// Button types
export type ButtonVariant = 'solid' | 'default' | 'outline' | 'dashed' | 'twoTone' | 'plain'
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs'
export type ButtonShape = 'round' | 'circle' | 'none'
export type ButtonColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'gray'
  | 'slate'
  | 'zinc'
  | 'neutral'
  | 'stone'

// Color levels
export type ColorLevel = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

// Modal types
export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string | ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
  closable?: boolean
  maskClosable?: boolean
  footer?: ReactNode
  children: ReactNode
  className?: string
}

// Drawer types
export type DrawerProps = {
  isOpen: boolean
  onClose: () => void
  title?: string | ReactNode
  placement?: 'top' | 'right' | 'bottom' | 'left'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  maskClosable?: boolean
  children: ReactNode
  className?: string
}

// Notification types
export type NotificationType = 'success' | 'warning' | 'error' | 'info'
export type NotificationPlacement =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'bottomCenter'

export type NotificationProps = {
  type?: NotificationType
  title?: string
  message: string
  duration?: number
  placement?: NotificationPlacement
  closable?: boolean
  icon?: ReactNode
  className?: string
}

// Toast types
export type ToastProps = {
  type?: NotificationType
  title?: string
  message: string
  duration?: number
  closable?: boolean
  icon?: ReactNode
  className?: string
}

// Avatar types
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'square'

export type AvatarProps = {
  src?: string
  alt?: string
  size?: AvatarSize
  shape?: AvatarShape
  icon?: ReactNode
  className?: string
}

// Badge types
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'

export type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  count?: number
  maxCount?: number
  showZero?: boolean
  className?: string
}

// Card types
export type CardProps = {
  title?: string | ReactNode
  subtitle?: string | ReactNode
  extra?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
  bordered?: boolean
  shadow?: boolean
  hoverable?: boolean
}

// Input types
export type InputSize = 'sm' | 'md' | 'lg'
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'

export type InputProps = {
  type?: InputType
  size?: InputSize
  placeholder?: string
  value?: string | number
  defaultValue?: string | number
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  autoFocus?: boolean
  autoComplete?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  className?: string
  prefix?: ReactNode
  suffix?: ReactNode
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onPressEnter?: () => void
}

// Select types
export type SelectOption = {
  label: string
  value: any
  disabled?: boolean
  icon?: ReactNode
  children?: SelectOption[]
}

export type SelectProps = {
  options: SelectOption[]
  value?: any
  defaultValue?: any
  placeholder?: string
  size?: InputSize
  disabled?: boolean
  loading?: boolean
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  allowClear?: boolean
  className?: string
  onChange?: (value: any) => void
  onSearch?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

// Table types
export type TableColumn<T = any> = {
  key: string
  title: string
  dataIndex: keyof T
  width?: number | string
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: T, index: number) => ReactNode
}

export type TableProps<T = any> = {
  columns: TableColumn<T>[]
  dataSource: T[]
  loading?: boolean
  pagination?:
    | boolean
    | {
        current?: number
        pageSize?: number
        total?: number
        showSizeChanger?: boolean
        showQuickJumper?: boolean
        showTotal?: (total: number, range: [number, number]) => string
      }
  rowKey?: string | ((record: T) => string)
  rowSelection?: {
    selectedRowKeys?: string[]
    onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void
  }
  scroll?: { x?: number | string; y?: number | string }
  size?: 'small' | 'middle' | 'default'
  bordered?: boolean
  className?: string
}
