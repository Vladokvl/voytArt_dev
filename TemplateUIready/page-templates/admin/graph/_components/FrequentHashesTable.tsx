'use client'

import { useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import type { ExtendedColumnDef } from '@/components/shared/DataTable'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminGraphHashRow } from '@/@types/adminGraph'
import AdminStaticDataTable from '../../invitations/_components/AdminStaticDataTable'
import HashStatusTag, { resolveHashContactStatus } from './HashStatusTag'

type FrequentHashesTableProps = {
  items: AdminGraphHashRow[]
  onSelectHash?: (hash: string) => void
}

export default function FrequentHashesTable({
  items,
  onSelectHash,
}: FrequentHashesTableProps) {
  const t = useTranslation('admin.graph')

  const columns = useMemo<ExtendedColumnDef<AdminGraphHashRow>[]>(
    () => [
      {
        header: t('columns.hash'),
        accessorKey: 'hashPreview',
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.hashPreview}</span>
        ),
      },
      {
        header: t('columns.phonebooks'),
        accessorKey: 'phonebookCount',
      },
      {
        header: t('columns.status'),
        accessorKey: 'isRegistered',
        cell: ({ row }) => (
          <HashStatusTag status={resolveHashContactStatus(row.original)} />
        ),
      },
      {
        header: t('columns.identity'),
        accessorKey: 'maskedCode',
        cell: ({ row }) => {
          const item = row.original

          if (item.isRegistered && item.registeredUserId) {
            return (
              <Link
                href={`/admin/users/${item.registeredUserId}`}
                className="text-primary hover:underline"
                onClick={event => event.stopPropagation()}
              >
                {item.registeredUserName || item.registeredUserId}
              </Link>
            )
          }

          return (
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
              {item.maskedCode ?? '—'}
            </span>
          )
        },
      },
    ],
    [t],
  )

  if (items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">{t('emptyFrequent')}</p>
  }

  return (
    <AdminStaticDataTable
      data={items}
      columns={columns}
      pageSize={10}
      onRowClick={onSelectHash ? row => onSelectHash(row.hash) : undefined}
    />
  )
}
