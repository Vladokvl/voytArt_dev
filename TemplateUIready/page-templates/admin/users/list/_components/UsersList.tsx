'use client'

import { useMemo } from 'react'
import dayjs from 'dayjs'
import { DataList, buildDataListConfig } from '@/components/shared/DataList'
import { Avatar, Tag } from '@/components/ui'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminUserListItem, AdminUserAccountStatus } from '@/@types/adminUsers'

const statusTagClass: Record<AdminUserAccountStatus, string> = {
  active:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-0',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0',
  suspended: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-0',
  banned: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-0',
}

export default function UsersList() {
  const tAdmin = useTranslation('admin')
  const tCommon = useTranslation('common')

  const config = useMemo(
    () =>
      buildDataListConfig<AdminUserListItem>({
        title: tAdmin('users.listTitle'),
        columns: [
          {
            key: 'user',
            title: tAdmin('users.columns.name'),
            dataIndex: 'name',
            width: 220,
            render: (_value, record) => {
              const displayName = record.name || tCommon('anonymous')
              return (
                <div className="flex items-center gap-3">
                  <Avatar size={36} src={record.avatar || undefined} className="shrink-0">
                    {!record.avatar && displayName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold heading-text">{displayName}</span>
                    {record.maskedCode && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                        {record.maskedCode}
                      </span>
                    )}
                  </div>
                </div>
              )
            },
          },
          {
            key: 'partialNumber',
            title: tAdmin('users.columns.partialNumber'),
            dataIndex: 'partialNumber',
            render: value => value || tAdmin('users.notProvided'),
          },
          {
            key: 'city',
            title: tAdmin('users.columns.city'),
            dataIndex: 'city',
            render: value => value || tAdmin('users.notProvided'),
          },
          {
            key: 'universe',
            title: tAdmin('users.columns.universe'),
            dataIndex: 'universe',
            render: value => value || tAdmin('users.notProvided'),
          },
          {
            key: 'signupDate',
            title: tAdmin('users.columns.signupDate'),
            dataIndex: 'signupDate',
            render: value =>
              value ? dayjs(value).format('DD.MM.YYYY') : tAdmin('users.notProvided'),
          },
          {
            key: 'status',
            title: tAdmin('users.columns.status'),
            dataIndex: 'status',
            render: (value: AdminUserAccountStatus) => (
              <Tag className={statusTagClass[value] ?? statusTagClass.inactive}>
                {tAdmin(`users.status.${value}`)}
              </Tag>
            ),
          },
        ],
        filters: [
          {
            key: 'registeredFrom',
            label: tAdmin('users.filters.registeredFrom'),
            type: 'date',
          },
          {
            key: 'registeredTo',
            label: tAdmin('users.filters.registeredTo'),
            type: 'date',
          },
          {
            key: 'status',
            label: tAdmin('users.filters.status.label'),
            type: 'select',
            options: [
              { label: tAdmin('users.filters.status.all'), value: '' },
              { label: tAdmin('users.status.active'), value: 'active' },
              { label: tAdmin('users.status.inactive'), value: 'inactive' },
              { label: tAdmin('users.status.suspended'), value: 'suspended' },
              { label: tAdmin('users.status.banned'), value: 'banned' },
            ],
          },
          {
            key: 'sortBy',
            label: tAdmin('users.filters.sortBy'),
            type: 'select',
            options: [
              { label: tAdmin('users.sort.default'), value: '' },
              { label: tAdmin('users.sort.createdAt'), value: 'createdAt' },
              { label: tAdmin('users.sort.name'), value: 'name' },
              { label: tAdmin('users.sort.city'), value: 'city' },
              { label: tAdmin('users.sort.status'), value: 'status' },
            ],
          },
          {
            key: 'sortOrder',
            label: tAdmin('users.filters.sortOrder'),
            type: 'select',
            options: [
              { label: tAdmin('users.sortOrder.desc'), value: 'desc' },
              { label: tAdmin('users.sortOrder.asc'), value: 'asc' },
            ],
          },
        ],
        api: {
          endpoint: '/api/v1/admin/users',
          method: 'GET',
        },
        routes: {
          view: '/admin/users/:id',
        },
        search: {
          enabled: true,
          placeholder: tAdmin('users.searchPlaceholder'),
        },
        pagination: {
          pageSize: 20,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: true,
        },
        selection: {
          enabled: false,
        },
        export: {
          enabled: false,
        },
      }),
    [tAdmin, tCommon]
  )

  return <DataList config={config} />
}
