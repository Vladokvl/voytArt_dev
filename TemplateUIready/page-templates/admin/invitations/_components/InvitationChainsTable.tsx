'use client'

import { useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import { Avatar } from '@/components/ui'
import type { ExtendedColumnDef } from '@/components/shared/DataTable'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminInvitationsChainNode } from '@/@types/adminInvitations'
import AdminStaticDataTable from './AdminStaticDataTable'

type InvitationChainsTableProps = {
  items: AdminInvitationsChainNode[]
}

function depthIndent(depth: number): string {
  return `${'\u00A0'.repeat(depth * 4)}${depth > 0 ? '↳ ' : ''}`
}

export default function InvitationChainsTable({ items }: InvitationChainsTableProps) {
  const t = useTranslation('admin.invitations')

  const columns = useMemo<ExtendedColumnDef<AdminInvitationsChainNode>[]>(
    () => [
      {
        header: t('columns.user'),
        accessorKey: 'name',
        size: 220,
        cell: ({ row }) => {
          const node = row.original
          const displayName = node.name || t('anonymousUser')

          return (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400 shrink-0">
                {depthIndent(node.depth)}
              </span>
              <Avatar size={36} className="shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex flex-col">
                <Link
                  href={`/admin/users/${node.userId}`}
                  className="font-semibold heading-text hover:text-primary"
                  onClick={event => event.stopPropagation()}
                >
                  {displayName}
                </Link>
                {node.maskedCode && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                    {node.maskedCode}
                  </span>
                )}
              </div>
            </div>
          )
        },
      },
      {
        header: t('columns.invitedBy'),
        accessorKey: 'inviterName',
        cell: ({ row }) => {
          const node = row.original

          if (!node.invitedById) {
            return <span className="text-gray-400">{t('rootInviter')}</span>
          }

          return (
            <Link
              href={`/admin/users/${node.invitedById}`}
              className="text-primary hover:underline"
              onClick={event => event.stopPropagation()}
            >
              {node.inviterName || t('anonymousUser')}
            </Link>
          )
        },
      },
      {
        header: t('columns.depth'),
        accessorKey: 'depth',
        size: 72,
      },
      {
        header: t('columns.directInvitees'),
        accessorKey: 'directInvitees',
      },
      {
        header: t('columns.sent'),
        accessorKey: 'invitationsSent',
      },
      {
        header: t('columns.accepted'),
        accessorKey: 'invitationsAccepted',
      },
    ],
    [t],
  )

  if (items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">{t('emptyChains')}</p>
  }

  return (
    <AdminStaticDataTable
      data={items}
      columns={columns}
      pageSize={10}
    />
  )
}
