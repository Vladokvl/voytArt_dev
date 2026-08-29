'use client'

import { TbSearch, TbFilter } from 'react-icons/tb'
import useTranslation from '@/utils/hooks/useTranslation'

interface DataListEmptyProps {
  hasFilters: boolean
  hasSearch: boolean
}

export function DataListEmpty({ hasFilters, hasSearch }: DataListEmptyProps) {
  const t = useTranslation('common')
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-6xl text-gray-300">{hasSearch ? <TbSearch /> : <TbFilter />}</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {t('noItemsFound')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        {hasSearch || hasFilters ? t('noItemsMatchSearch') : t('noItemsAvailable')}
      </p>
    </div>
  )
}
