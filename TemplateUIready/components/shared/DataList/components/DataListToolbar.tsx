'use client'

import { ReactNode } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import { useRouter } from '@/i18n/navigation'
import Button from '@/components/ui/Button'
import { TbCloudDownload } from 'react-icons/tb'
import dynamic from 'next/dynamic'
import { DataListSearch } from './DataListSearch'
import { DataListFilter } from './DataListFilter'
import type { DataListConfig, DataListState, BaseListItem, ActionButton } from '../types'

const CSVLink = dynamic(() => import('react-csv').then(mod => mod.CSVLink), {
  ssr: false,
})

interface DataListToolbarProps<T extends BaseListItem> {
  config: DataListConfig<T>
  state: DataListState<T>
  onSearchChange: (query: string) => void
  onFilterChange: (filters: Record<string, any>) => void
  customRenderer?: (config: DataListConfig<T>, state: DataListState<T>) => ReactNode
}

export function DataListToolbar<T extends BaseListItem>({
  config,
  state,
  onSearchChange,
  onFilterChange,
  customRenderer,
}: DataListToolbarProps<T>) {
  const t = useTranslation('common')
  const router = useRouter()

  if (customRenderer) {
    return <>{customRenderer(config, state)}</>
  }

  const handleActionClick = (action: ActionButton) => {
    if (action.onClick) {
      action.onClick()
    } else if (action.href) {
      router.push(action.href)
    }
  }

  const renderActions = () => {
    if ((!config.actions || config.actions.length === 0) && !config.export?.enabled) return null

    return (
      <div className="flex flex-col md:flex-row gap-3">
        {/* Експорт */}
        {config.export?.enabled && (
          <CSVLink
            filename={config.export.filename || 'data-export.csv'}
            data={
              config.export.dataTransform ? config.export.dataTransform(state.data) : state.data
            }
          >
            <Button icon={<TbCloudDownload className="text-xl" />}>{t('export')}</Button>
          </CSVLink>
        )}

        {/* Кнопки дій */}
        {config?.actions &&
          config?.actions
            .filter(action => action.key !== 'edit' && action.key !== 'delete')
            .map(action => {
              const shouldShow = action.showWhen ? action.showWhen(state.selectedItems) : true
              if (!shouldShow) return null

              return (
                <Button
                  key={action.key}
                  variant={action?.variant || 'solid'}
                  icon={action.icon}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              )
            })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Заголовок з кнопками */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h3 className="text-lg font-semibold">{config.title}</h3>
        {renderActions()}
      </div>

      {/* Пошук та фільтри */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        {/* Пошук */}
        {config.search?.enabled && (
          <DataListSearch placeholder={config.search.placeholder} onSearchChange={onSearchChange} />
        )}

        {/* Фільтри - показуємо тільки якщо є масив фільтрів */}
        {config.filters && config.filters.length > 0 && (
          <DataListFilter
            filters={config.filters}
            currentFilters={state.filters}
            onFilterChange={onFilterChange}
          />
        )}
      </div>
    </div>
  )
}
