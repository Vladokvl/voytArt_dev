'use client'

import { ReactNode } from 'react'
import type { DataListConfig, BaseListItem } from '../types'

interface DataListHeaderProps<T extends BaseListItem> {
  config: DataListConfig<T>
  customRenderer?: (config: DataListConfig<T>) => ReactNode
}

export function DataListHeader<T extends BaseListItem>({
  config,
  customRenderer,
}: DataListHeaderProps<T>) {
  if (customRenderer) {
    return <>{customRenderer(config)}</>
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <h3 className="text-lg font-semibold">{config.title}</h3>
    </div>
  )
}
