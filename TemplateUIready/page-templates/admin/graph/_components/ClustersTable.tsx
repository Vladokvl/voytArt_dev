'use client'

import { useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import type { ExtendedColumnDef } from '@/components/shared/DataTable'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminGraphCluster } from '@/@types/adminGraph'
import AdminStaticDataTable from '../../invitations/_components/AdminStaticDataTable'

type ClustersTableProps = {
  items: AdminGraphCluster[]
  onSelectCluster?: (clusterId: number) => void
}

export default function ClustersTable({
  items,
  onSelectCluster,
}: ClustersTableProps) {
  const t = useTranslation('admin.graph')

  const columns = useMemo<ExtendedColumnDef<AdminGraphCluster>[]>(
    () => [
      {
        header: '#',
        accessorKey: 'clusterId',
        size: 56,
      },
      {
        header: t('columns.members'),
        accessorKey: 'memberCount',
      },
      {
        header: t('columns.sampleMembers'),
        accessorKey: 'members',
        cell: ({ row }) => {
          const sample = row.original.members.slice(0, 3)

          return (
            <div className="flex flex-col gap-1">
              {sample.map(member => (
                <Link
                  key={member.userId}
                  href={`/admin/users/${member.userId}`}
                  className="text-sm text-primary hover:underline"
                  onClick={event => event.stopPropagation()}
                >
                  {member.name || member.maskedCode || member.userId}
                </Link>
              ))}
              {row.original.memberCount > 3 && (
                <span className="text-xs text-gray-400">
                  +{row.original.memberCount - 3} {t('moreMembers')}
                </span>
              )}
            </div>
          )
        },
      },
    ],
    [t],
  )

  if (items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">{t('emptyClusters')}</p>
  }

  return (
    <AdminStaticDataTable
      data={items}
      columns={columns}
      pageSize={10}
      onRowClick={
        onSelectCluster
          ? row => onSelectCluster(row.clusterId)
          : undefined
      }
    />
  )
}
