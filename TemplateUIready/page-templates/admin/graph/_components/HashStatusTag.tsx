'use client'

import { Tag } from '@/components/ui'
import useTranslation from '@/utils/hooks/useTranslation'

export type HashContactStatus = 'registered' | 'unregistered' | 'universal'

const hashStatusTagClass: Record<HashContactStatus, string> = {
  registered:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-0',
  unregistered: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0',
  universal: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-0',
}

type HashStatusTagProps = {
  status: HashContactStatus
}

export default function HashStatusTag({ status }: HashStatusTagProps) {
  const t = useTranslation('admin.graph')

  const labelKey =
    status === 'registered'
      ? 'status.registered'
      : status === 'universal'
        ? 'status.universal'
        : 'status.unregistered'

  return <Tag className={hashStatusTagClass[status]}>{t(labelKey)}</Tag>
}

export function resolveHashContactStatus(item: {
  isRegistered: boolean
  isUniversal: boolean
}): HashContactStatus {
  if (item.isRegistered) {
    return 'registered'
  }

  if (item.isUniversal) {
    return 'universal'
  }

  return 'unregistered'
}
