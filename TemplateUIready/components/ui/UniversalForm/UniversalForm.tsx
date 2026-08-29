'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import classNames from 'classnames'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Button from '../Button/Button'
import FormSwitcher from './FormSwitcher'
import useTranslation from '@/utils/hooks/useTranslation'
import type { InputConfig, UniversalFormProps } from './types'
import './UniversalForm.css'
import { generateValidationSchema } from './validationUtils'

const UniversalForm: React.FC<UniversalFormProps> = ({
  config,
  defaultValues = {},
  fieldDefaultValues = {},
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  loading = false,
  disabled = false,
  showSubmitButton = true,
  showCancelButton = true,
  customSubmitButton,
  customCancelButton,
  formClassName,
  submitButtonClassName,
  cancelButtonClassName,
  className,
  style,
  children,
}) => {
  const t = useTranslation('common')
  const submitLabel = submitText ?? t('save')
  const cancelLabel = cancelText ?? t('cancel')
  const validationSchema = React.useMemo(
    () => generateValidationSchema(config.inputs),
    [config.inputs]
  )

  // Підготовка дефолтних значень
  const defaultFormValues = React.useMemo(() => {
    const prepared: Record<string, any> = { ...defaultValues }

    config.inputs.forEach(input => {
      // Пріоритет: fieldDefaultValues > input.defaultValue > defaultValues
      if (prepared[input.name] === undefined) {
        if (fieldDefaultValues[input.name] !== undefined) {
          prepared[input.name] = fieldDefaultValues[input.name]
        } else if (input.defaultValue !== undefined) {
          prepared[input.name] = input.defaultValue
        }
      }
    })

    return prepared
  }, [defaultValues, fieldDefaultValues, config.inputs])

  const methods = useForm({
    defaultValues: defaultFormValues,
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = methods

  // Відстежуємо зміни для умовного відображення
  const watchedValues = watch()

  // Обробка відправки форми
  const handleFormSubmit = async (values: Record<string, any>) => {
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // Обробка скасування
  const handleFormCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      reset()
    }
  }

  // Фільтрація видимих полів на основі умов
  const getVisibleInputs = React.useCallback((): InputConfig[] => {
    return config.inputs.filter(input => {
      if (!input.conditional) return true

      const { field, value, operator = 'equals' } = input.conditional
      const conditionalValue = watchedValues[field]

      switch (operator) {
        case 'equals':
          return conditionalValue === value
        case 'not_equals':
          return conditionalValue !== value
        case 'contains':
          return Array.isArray(conditionalValue)
            ? conditionalValue.includes(value)
            : String(conditionalValue).includes(String(value))
        case 'greater_than':
          return Number(conditionalValue) > Number(value)
        case 'less_than':
          return Number(conditionalValue) < Number(value)
        default:
          return true
      }
    })
  }, [config.inputs, watchedValues])

  // Генерація класів для layout
  const getLayoutClasses = React.useCallback(() => {
    const baseClasses = 'universal-form-base'

    switch (config.layout) {
      case 'horizontal':
        return classNames(baseClasses, 'universal-form-horizontal')
      case 'grid':
        const columns = config.columns || 2
        return classNames(baseClasses, 'universal-form-grid', `universal-form-grid-${columns}`)
      default:
        return classNames(baseClasses, 'universal-form-vertical')
    }
  }, [config.layout, config.columns])

  // Генерація класів для spacing
  const getSpacingClasses = React.useCallback(() => {
    switch (config.spacing) {
      case 'sm':
        return 'universal-form-spacing-sm'
      case 'lg':
        return 'universal-form-spacing-lg'
      default:
        return 'universal-form-spacing-md'
    }
  }, [config.spacing])

  const visibleInputs = getVisibleInputs()
  const isFormDisabled = disabled || loading || isSubmitting
  const layoutClasses = getLayoutClasses()
  const spacingClasses = getSpacingClasses()

  return (
    <div className={classNames('universal-form', className)} style={style}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className={classNames(
            'universal-form-form',
            spacingClasses,
            formClassName,
            isFormDisabled && 'universal-form-disabled'
          )}
        >
          {/* Поля форми */}
          <div className={layoutClasses}>
            {visibleInputs.map(inputConfig => (
              <div
                key={inputConfig.name}
                className={classNames(config.layout === 'horizontal' && 'flex-1 min-w-0')}
              >
                <FormSwitcher
                  config={inputConfig}
                  disabled={isFormDisabled}
                  className={inputConfig.className}
                  size={config.size}
                />
              </div>
            ))}
          </div>

          {/* Кастомний контент */}
          {children}

          {/* Кнопки */}
          {(showSubmitButton || showCancelButton) && (
            <div className="universal-form-buttons">
              {showCancelButton &&
                (customCancelButton || (
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleFormCancel}
                    disabled={isFormDisabled}
                    className={cancelButtonClassName}
                  >
                    {cancelLabel}
                  </Button>
                ))}

              {showSubmitButton &&
                (customSubmitButton || (
                  <Button
                    type="submit"
                    variant="solid"
                    loading={loading || isSubmitting}
                    disabled={isFormDisabled}
                    className={submitButtonClassName}
                  >
                    {submitLabel}
                  </Button>
                ))}
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export default UniversalForm
