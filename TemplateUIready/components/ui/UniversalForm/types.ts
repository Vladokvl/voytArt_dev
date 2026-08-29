import { CSSProperties, ReactNode } from 'react'
import { z } from 'zod'
import type { CommonProps, TypeAttributes } from '../@types/common'

// Типи для різних інпутів
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'switch'

// Базовий інтерфейс для всіх інпутів
export interface BaseInputConfig {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  style?: CSSProperties
  helpText?: string
  errorMessage?: string
  defaultValue?: any
  validation?: z.ZodType<any>
  customValidation?: (value: any) => string | undefined
  dependencies?: string[] // для залежних полів
  conditional?: {
    field: string
    value: any
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  }
}

// Специфічні конфігурації для різних типів інпутів
export interface TextInputConfig extends BaseInputConfig {
  type: 'text' | 'email' | 'password' | 'tel' | 'url'
  maxLength?: number
  minLength?: number
  pattern?: string
}

export interface NumberInputConfig extends BaseInputConfig {
  type: 'number'
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
}

export interface TextareaInputConfig extends BaseInputConfig {
  type: 'textarea'
  rows?: number
  maxLength?: number
  minLength?: number
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectInputConfig extends BaseInputConfig {
  type: 'select'
  options: SelectOption[]
  isSearchable?: boolean
  isClearable?: boolean
  isMulti?: false
}

export interface MultiSelectInputConfig extends BaseInputConfig {
  type: 'multiselect'
  options: SelectOption[]
  isSearchable?: boolean
  isClearable?: boolean
  isMulti: true
}

export interface CheckboxInputConfig extends BaseInputConfig {
  type: 'checkbox'
  options?: SelectOption[] // для групи чекбоксів
}

export interface RadioInputConfig extends BaseInputConfig {
  type: 'radio'
  options: SelectOption[]
}

export interface DateInputConfig extends BaseInputConfig {
  type: 'date'
  minDate?: Date
  maxDate?: Date
  format?: string
}

export interface FileInputConfig extends BaseInputConfig {
  type: 'file'
  accept?: string
  multiple?: boolean
  maxSize?: number // в байтах
}

export interface SwitchInputConfig extends BaseInputConfig {
  type: 'switch'
  checkedValue?: any
  uncheckedValue?: any
}

// Об'єднаний тип для всіх конфігурацій інпутів
export type InputConfig =
  | TextInputConfig
  | NumberInputConfig
  | TextareaInputConfig
  | SelectInputConfig
  | MultiSelectInputConfig
  | CheckboxInputConfig
  | RadioInputConfig
  | DateInputConfig
  | FileInputConfig
  | SwitchInputConfig

// Конфігурація форми
export interface FormConfig {
  inputs: InputConfig[]
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: number // для grid layout
  spacing?: 'sm' | 'md' | 'lg'
  size?: TypeAttributes.ControlSize
  className?: string
  style?: CSSProperties
}

// Пропси для UniversalForm
export interface UniversalFormProps extends CommonProps {
  config: FormConfig
  defaultValues?: Record<string, any>
  onSubmit: (values: Record<string, any>) => void | Promise<void>
  onCancel?: () => void
  submitText?: string
  cancelText?: string
  loading?: boolean
  disabled?: boolean
  showSubmitButton?: boolean
  showCancelButton?: boolean
  customSubmitButton?: ReactNode
  customCancelButton?: ReactNode
  formClassName?: string
  submitButtonClassName?: string
  cancelButtonClassName?: string
  // Додаємо підтримку defaultValue для окремих полів
  fieldDefaultValues?: Record<string, any>
}

// Типи для валідації
export type ValidationRule = {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  url?: boolean
  custom?: (value: any) => string | undefined
}

export type ValidationSchema = Record<string, ValidationRule>

// Типи для обробки подій
export type InputChangeHandler = (name: string, value: any) => void
export type InputBlurHandler = (name: string) => void
export type InputFocusHandler = (name: string) => void
