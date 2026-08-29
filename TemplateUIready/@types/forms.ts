// Import SelectOption from ui types
import type { SelectOption } from './ui'

// Form validation types
export type ValidationRule = {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
  validator?: (value: any) => boolean | string
}

export type ValidationSchema = {
  [key: string]: ValidationRule | ValidationRule[]
}

// Form field types
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'hidden'

export type FormField = {
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  validation?: ValidationRule | ValidationRule[]
  options?: SelectOption[]
  defaultValue?: any
  disabled?: boolean
  readOnly?: boolean
  autoComplete?: string
  rows?: number
  cols?: number
  accept?: string
  multiple?: boolean
  min?: number
  max?: number
  step?: number
}

// Form configuration
export type FormConfig = {
  fields: FormField[]
  validationSchema?: ValidationSchema
  onSubmit: (data: any) => void | Promise<void>
  onCancel?: () => void
  submitText?: string
  cancelText?: string
  loading?: boolean
  disabled?: boolean
}

// Form state
export type FormState = {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

// Form event handlers
export type InputChangeHandler = (name: string, value: any) => void
export type InputBlurHandler = (name: string) => void
export type InputFocusHandler = (name: string) => void

// Universal form props
export type UniversalFormProps = {
  config: FormConfig
  initialValues?: Record<string, any>
  className?: string
  layout?: 'vertical' | 'horizontal' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  showValidation?: boolean
  autoFocus?: boolean
}
