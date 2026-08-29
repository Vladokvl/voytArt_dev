'use client'

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Checkbox from '../Checkbox/Checkbox'
import DatePicker from '../DatePicker/DatePicker'
import FormItem from '../Form/FormItem'
import Input from '../Input/Input'
import Radio from '../Radio/Radio'
import Select from '../Select/Select'
import { InputConfig } from './types'

interface FormSwitcherProps {
  config: InputConfig
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const FormSwitcher: React.FC<FormSwitcherProps> = ({
  config,
  disabled = false,
  className,
  size = 'md',
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext()

  const error = errors[config.name]?.message as string
  const isDisabled = disabled || config.disabled

  // Перевірка умовного відображення
  if (config.conditional) {
    const { field, value, operator = 'equals' } = config.conditional
    const conditionalValue = watch(field)

    let shouldShow = false
    switch (operator) {
      case 'equals':
        shouldShow = conditionalValue === value
        break
      case 'not_equals':
        shouldShow = conditionalValue !== value
        break
      case 'contains':
        shouldShow = Array.isArray(conditionalValue)
          ? conditionalValue.includes(value)
          : String(conditionalValue).includes(String(value))
        break
      case 'greater_than':
        shouldShow = Number(conditionalValue) > Number(value)
        break
      case 'less_than':
        shouldShow = Number(conditionalValue) < Number(value)
        break
    }

    if (!shouldShow) return null
  }

  const renderInput = () => {
    switch (config.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
        return (
          <Input
            {...register(config.name)}
            type={config.type}
            placeholder={config.placeholder}
            disabled={isDisabled}
            className={config.className}
            style={config.style}
            maxLength={config.maxLength}
            minLength={config.minLength}
            pattern={config.pattern}
            size={size}
          />
        )

      case 'number':
        return (
          <Input
            {...register(config.name)}
            type="number"
            placeholder={config.placeholder}
            disabled={isDisabled}
            className={config.className}
            style={config.style}
            min={config.min}
            max={config.max}
            step={config.step}
            prefix={config.prefix}
            suffix={config.suffix}
            size={size}
          />
        )

      case 'textarea':
        return (
          <Input
            {...register(config.name)}
            textArea
            placeholder={config.placeholder}
            disabled={isDisabled}
            className={config.className}
            style={config.style}
            rows={config.rows}
            maxLength={config.maxLength}
            minLength={config.minLength}
            size={size}
          />
        )

      case 'select':
        return (
          <Controller
            name={config.name}
            control={control}
            render={({ field }) => (
              <Select
                options={config.options}
                placeholder={config.placeholder}
                isDisabled={isDisabled}
                className={config.className}
                isSearchable={config.isSearchable}
                isClearable={config.isClearable}
                value={config.options.find(opt => opt.value === field.value)}
                onChange={option => field.onChange(option?.value)}
                size={size}
              />
            )}
          />
        )

      case 'multiselect':
        return (
          <Controller
            name={config.name}
            control={control}
            render={({ field }) => (
              <Select
                options={config.options}
                placeholder={config.placeholder}
                isDisabled={isDisabled}
                className={config.className}
                isSearchable={config.isSearchable}
                isClearable={config.isClearable}
                isMulti
                value={config.options.filter(
                  opt => Array.isArray(field.value) && field.value.includes(opt.value)
                )}
                onChange={options => field.onChange(options ? options.map(opt => opt.value) : [])}
                size={size}
              />
            )}
          />
        )

      case 'checkbox':
        if (config.options) {
          // Група чекбоксів
          return (
            <Controller
              name={config.name}
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {config.options?.map(option => (
                    <Checkbox
                      key={option.value}
                      value={option.value}
                      disabled={isDisabled || option.disabled}
                      checked={Array.isArray(field.value) && field.value.includes(option.value)}
                      onChange={checked => {
                        const currentValues = Array.isArray(field.value) ? field.value : []
                        if (checked) {
                          field.onChange([...currentValues, option.value])
                        } else {
                          field.onChange(currentValues.filter(v => v !== option.value))
                        }
                      }}
                    >
                      {option.label}
                    </Checkbox>
                  ))}
                </div>
              )}
            />
          )
        } else {
          // Одиночний чекбокс
          return (
            <Controller
              name={config.name}
              control={control}
              render={({ field }) => (
                <Checkbox
                  disabled={isDisabled}
                  checked={field.value}
                  onChange={checked => field.onChange(checked)}
                >
                  {config.label}
                </Checkbox>
              )}
            />
          )
        }

      case 'radio':
        return (
          <Controller
            name={config.name}
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {config.options?.map(option => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    disabled={isDisabled || option.disabled}
                    checked={field.value === option.value}
                    onChange={value => field.onChange(value)}
                  >
                    {option.label}
                  </Radio>
                ))}
              </div>
            )}
          />
        )

      case 'date':
        return (
          <Controller
            name={config.name}
            control={control}
            render={({ field }) => (
              <DatePicker
                placeholder={config.placeholder}
                disabled={isDisabled}
                className={config.className}
                value={field.value}
                onChange={date => field.onChange(date)}
                minDate={config.minDate}
                maxDate={config.maxDate}
                size={size}
              />
            )}
          />
        )

      case 'file':
        return (
          <Input
            {...register(config.name)}
            type="file"
            accept={config.accept}
            multiple={config.multiple}
            disabled={isDisabled}
            className={config.className}
            style={config.style}
            size={size}
          />
        )

      case 'switch':
        return (
          <Controller
            name={config.name}
            control={control}
            render={({ field }) => {
              const isChecked = field.value === config.checkedValue
              return (
                <div className="flex items-center">
                  <div
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${isChecked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    onClick={() => {
                      if (!isDisabled) {
                        const newValue = isChecked ? config.uncheckedValue : config.checkedValue
                        field.onChange(newValue)
                      }
                    }}
                  >
                    <span
                      className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${isChecked ? 'translate-x-6' : 'translate-x-1'}
                    `}
                    />
                  </div>
                  {config.label && (
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {config.label}
                    </span>
                  )}
                </div>
              )
            }}
          />
        )

      default:
        return (
          <Input
            {...register((config as any).name)}
            type="text"
            placeholder={(config as any).placeholder}
            disabled={isDisabled}
            className={(config as any).className}
            style={(config as any).style}
            size={size}
          />
        )
    }
  }

  return (
    <FormItem label={config.label} invalid={!!error} className={className}>
      {renderInput()}
      {error && <div className="universal-form-error">{error}</div>}
      {config.helpText && !error && <div className="universal-form-help">{config.helpText}</div>}
    </FormItem>
  )
}

export default FormSwitcher
