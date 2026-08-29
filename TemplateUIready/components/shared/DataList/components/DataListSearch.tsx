'use client'

import { useCallback, type ChangeEvent } from 'react'
import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import useTranslation from '@/utils/hooks/useTranslation'
import { TbSearch } from 'react-icons/tb'

interface DataListSearchProps {
  placeholder?: string
  onSearchChange: (value: string) => void
  debounceMs?: number
}

export function DataListSearch({
  placeholder,
  onSearchChange,
  debounceMs = 500,
}: DataListSearchProps) {
  const t = useTranslation('common')
  const searchPlaceholder = placeholder ?? t('searchPlaceholder')
  const handleDebounceFn = useCallback(
    (value: string) => {
      onSearchChange?.(value)
    },
    [onSearchChange]
  )

  const debounceFn = useDebounce(handleDebounceFn, debounceMs)

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      debounceFn(e.target.value)
    },
    [debounceFn]
  )

  return (
    <Input
      placeholder={searchPlaceholder}
      suffix={<TbSearch className="text-lg" />}
      onChange={handleInputChange}
    />
  )
}
