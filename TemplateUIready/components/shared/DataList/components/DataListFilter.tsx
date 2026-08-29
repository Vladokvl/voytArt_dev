'use client'

import { useState, useCallback } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { TbFilter, TbMinus } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import type { FilterConfig } from '../types'

interface DataListFilterProps {
  filters: FilterConfig[]
  currentFilters: Record<string, any>
  onFilterChange: (filters: Record<string, any>) => void
}

export function DataListFilter({ filters, currentFilters, onFilterChange }: DataListFilterProps) {
  const t = useTranslation('common')
  const [filterIsOpen, setFilterIsOpen] = useState(false)

  const { handleSubmit, control, reset } = useForm({
    defaultValues: currentFilters,
    // Temporarily disable validation for testing
    // resolver: zodResolver(validationSchema),
  })

  const onSubmit = useCallback(
    (values: Record<string, any>) => {
      // Improved filtering logic with proper request formation
      const filteredValues = Object.entries(values).reduce(
        (acc, [key, value]) => {
          // Skip undefined, null, empty strings and false for checkboxes
          if (value === undefined || value === null || value === '') {
            return acc
          }

          // Special handling for checkboxes
          if (typeof value === 'boolean') {
            if (value === true) {
              acc[key] = value
            }
            return acc
          }

          // Special handling for range filters
          if (typeof value === 'object' && value !== null) {
            const hasMin = value.min !== undefined && value.min !== null && value.min !== ''
            const hasMax = value.max !== undefined && value.max !== null && value.max !== ''

            if (hasMin || hasMax) {
              acc[key] = {
                ...(hasMin && { min: value.min }),
                ...(hasMax && { max: value.max }),
              }
            }
            return acc
          }

          // Special handling for date filters
          if (typeof value === 'string' && value.trim() !== '') {
            acc[key] = value.trim()
            return acc
          }

          // For all other types (string, number) - add if not empty
          if (value !== false) {
            acc[key] = value
          }

          return acc
        },
        {} as Record<string, any>
      )

      onFilterChange(filteredValues)
      setFilterIsOpen(false)
    },
    [onFilterChange]
  )

  const handleReset = useCallback(() => {
    reset({})
    onFilterChange({})
  }, [reset, onFilterChange])

  const handleOpenFilter = useCallback(() => {
    setFilterIsOpen(true)
  }, [])

  const handleCloseFilter = useCallback(() => {
    setFilterIsOpen(false)
  }, [])

  const renderFilterField = useCallback(
    (filter: FilterConfig) => {
      switch (filter.type) {
        case 'select':
          return (
            <FormItem key={filter.key} label={filter.label}>
              <Controller
                name={filter.key}
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder={filter.placeholder ?? t('selectPlaceholder')}
                    value={
                      field.value ? filter.options?.find(opt => opt.value === field.value) : null
                    }
                    onChange={option => {
                      // react-select returns object { value, label }, or null
                      const value = option ? (option as any).value : undefined
                      field.onChange(value)
                    }}
                    options={filter.options}
                  />
                )}
              />
            </FormItem>
          )

        case 'input':
          return (
            <FormItem key={filter.key} label={filter.label}>
              <Controller
                name={filter.key}
                control={control}
                render={({ field }) => (
                  <NumericInput
                    placeholder={filter.placeholder}
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                  />
                )}
              />
            </FormItem>
          )

        case 'date':
          return (
            <FormItem key={filter.key} label={filter.label}>
              <Controller
                name={filter.key}
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={filter.placeholder}
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value)}
                  />
                )}
              />
            </FormItem>
          )

        case 'checkbox':
          return (
            <FormItem key={filter.key} label={filter.label}>
              <Controller
                name={filter.key}
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={checked => field.onChange(checked)} />
                )}
              />
            </FormItem>
          )

        case 'range':
          return (
            <FormItem key={filter.key} label={filter.label}>
              <div className="flex items-center gap-2">
                <Controller
                  name={`${filter.key}.min`}
                  control={control}
                  render={({ field }) => (
                    <NumericInput
                      placeholder={t('min')}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  )}
                />
                <span>
                  <TbMinus />
                </span>
                <Controller
                  name={`${filter.key}.max`}
                  control={control}
                  render={({ field }) => (
                    <NumericInput
                      placeholder={t('max')}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </FormItem>
          )

        default:
          return null
      }
    },
    [control]
  )

  return (
    <>
      <Button icon={<TbFilter />} onClick={handleOpenFilter}>
        {t('filter')}
      </Button>
      <Drawer
        title={t('filter')}
        isOpen={filterIsOpen}
        onClose={handleCloseFilter}
        onRequestClose={handleCloseFilter}
      >
        <Form
          className="h-full"
          containerClassName="flex flex-col justify-between h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">{filters.map(renderFilterField)}</div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button type="submit" variant="solid" className="flex-1">
              {t('applyFilters')}
            </Button>
            <Button type="button" onClick={handleReset} className="flex-1">
              {t('reset')}
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  )
}
