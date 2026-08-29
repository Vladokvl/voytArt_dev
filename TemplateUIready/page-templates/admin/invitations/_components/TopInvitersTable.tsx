'use client'

import { useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import { Avatar } from '@/components/ui'
import type { ExtendedColumnDef } from '@/components/shared/DataTable'
import useTranslation from '@/utils/hooks/useTranslation'
import { formatPercent } from '@/utils/number'
import type { AdminInvitationsTopInviter } from '@/@types/adminInvitations'
import AdminStaticDataTable from './AdminStaticDataTable'

type TopInviterRow = AdminInvitationsTopInviter & { rank: number }

type TopInvitersTableProps = {
  items: AdminInvitationsTopInviter[]
}

export default function TopInvitersTable({ items }: TopInvitersTableProps) {
  const t = useTranslation('admin.invitations')

  const rankedItems = useMemo<TopInviterRow[]>(
    () => items.map((item, index) => ({ ...item, rank: index + 1 })),
    [items],
  )

  const columns = useMemo<ExtendedColumnDef<TopInviterRow>[]>(
    () => [
      {
        header: '#',
        accessorKey: 'rank',
        size: 56,
      },
      {
        header: t('columns.user'),
        accessorKey: 'name',
        cell: ({ row }) => {
          const inviter = row.original
          const displayName = inviter.name || t('anonymousUser')

          return (
            <div className="flex items-center gap-3">
              <Avatar size={36} className="shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex flex-col">
                <Link
                  href={`/admin/users/${inviter.userId}`}
                  className="font-semibold heading-text hover:text-primary"
                  onClick={event => event.stopPropagation()}
                >
                  {displayName}
                </Link>
                {inviter.maskedCode && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                    {inviter.maskedCode}
                  </span>
                )}
              </div>
            </div>
          )
        },
      },
      {
        header: t('columns.sent'),
        accessorKey: 'sent',
      },
      {
        header: t('columns.accepted'),
        accessorKey: 'accepted',
      },
      {
        header: t('columns.conversion'),
        accessorKey: 'conversionRate',
        cell: ({ row }) => formatPercent(row.original.conversionRate),
      },
    ],
    [t],
  )

  if (items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">{t('emptyTopInviters')}</p>
  }

  return (
    <AdminStaticDataTable
      data={rankedItems}
      columns={columns}
      pageSize={10}
    />
  )
}
