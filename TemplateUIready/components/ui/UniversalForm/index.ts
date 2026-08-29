export { default as FormSwitcher } from './FormSwitcher'
export { default as UniversalForm } from './UniversalForm'
export * from './validationUtils'

// Експортуємо типи з центрального @types
export type {
  FormConfig,
  FormField,
  FormFieldType,
  InputBlurHandler,
  InputChangeHandler,
  InputFocusHandler,
  UniversalFormProps,
  ValidationRule,
  ValidationSchema,
} from '@/@types/forms'

// Re-export SelectOption from ui types
export type { SelectOption } from '@/@types/ui'

// Re-export InputType for backward compatibility
export type { InputType } from '@/@types/ui'

// Експорт утиліт
export {
  checkDependencies,
  generateSchemaFromRules,
  generateValidationSchema,
  shouldShowField,
} from './validationUtils'
