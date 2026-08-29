'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import DataTable from '@/components/shared/DataTable'
import Button from '@/components/ui/Button'
import { Input, Select, Switcher } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { toast } from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { AdminModerationService } from '@/services/admin/AdminModerationService'
import useTranslation from '@/utils/hooks/useTranslation'
import { Link } from '@/i18n/navigation'
import type {
  AdminAuditLog,
  AdminRateLimits,
  AdminUserReport,
  UserReportStatus,
} from '@/@types/adminModeration'
import { DATE_FORMATS, formatDate } from '@/utils/dateDisplay'

export default function ModerationDashboard() {
  const t = useTranslation('admin.moderation')
  const tCommon = useTranslation('common')

  const [reports, setReports] = useState<AdminUserReport[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<UserReportStatus | ''>('pending')
  const [resolveTarget, setResolveTarget] = useState<AdminUserReport | null>(null)
  const [resolveStatus, setResolveStatus] = useState<'resolved' | 'dismissed'>('resolved')
  const [adminNote, setAdminNote] = useState('')
  const [suspendUser, setSuspendUser] = useState(false)
  const [resolving, setResolving] = useState(false)

  const [rateLimits, setRateLimits] = useState<AdminRateLimits | null>(null)
  const [rateLoading, setRateLoading] = useState(true)
  const [rateSaving, setRateSaving] = useState(false)

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([])
  const [auditLoading, setAuditLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('')

  const loadReports = useCallback(async () => {
    try {
      setReportsLoading(true)
      const res = await AdminModerationService.listReports({
        status: statusFilter || undefined,
        limit: 50,
        page: 1,
      })
      setReports(res?.data.reports ?? [])
    } catch (e) {
      console.error(e)
      setReports([])
    } finally {
      setReportsLoading(false)
    }
  }, [statusFilter])

  const loadRateLimits = useCallback(async () => {
    try {
      setRateLoading(true)
      const data = await AdminModerationService.getRateLimits()
      if (data) setRateLimits(data)
    } catch (e) {
      console.error(e)
    } finally {
      setRateLoading(false)
    }
  }, [])

  const loadAudit = useCallback(async () => {
    try {
      setAuditLoading(true)
      const res = await AdminModerationService.listAuditLogs({
        action: actionFilter || undefined,
        limit: 50,
        page: 1,
      })
      setAuditLogs(res?.data.logs ?? [])
    } catch (e) {
      console.error(e)
      setAuditLogs([])
    } finally {
      setAuditLoading(false)
    }
  }, [actionFilter])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  useEffect(() => {
    loadRateLimits()
    loadAudit()
  }, [loadRateLimits, loadAudit])

  const reportColumns = useMemo<ColumnDef<AdminUserReport>[]>(
    () => [
      {
        header: t('reports.columns.date'),
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.original.createdAt, DATE_FORMATS.MEDIUM),
      },
      {
        header: t('reports.columns.reason'),
        accessorKey: 'reason',
        cell: ({ row }) => t(`reports.reasons.${row.original.reason}` as string),
      },
      {
        header: t('reports.columns.reported'),
        id: 'reported',
        cell: ({ row }) => (
          <Link
            href={`/admin/users/${row.original.reportedUser.id}`}
            className="text-primary hover:underline"
          >
            {row.original.reportedUser.name ?? row.original.reportedUser.email ?? '—'}
          </Link>
        ),
      },
      {
        header: t('reports.columns.reporter'),
        id: 'reporter',
        cell: ({ row }) => row.original.reporter.name ?? row.original.reporter.email ?? '—',
      },
      {
        header: t('reports.columns.status'),
        accessorKey: 'status',
        cell: ({ row }) => t(`reports.statuses.${row.original.status}`),
      },
      {
        header: '',
        id: 'actions',
        cell: ({ row }) =>
          row.original.status === 'pending' ? (
            <Button size="sm" variant="solid" onClick={() => setResolveTarget(row.original)}>
              {t('reports.review')}
            </Button>
          ) : null,
      },
    ],
    [t],
  )

  const auditColumns = useMemo<ColumnDef<AdminAuditLog>[]>(
    () => [
      {
        header: t('audit.columns.date'),
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.original.createdAt, DATE_FORMATS.MEDIUM),
      },
      { header: t('audit.columns.action'), accessorKey: 'action' },
      {
        header: t('audit.columns.target'),
        id: 'target',
        cell: ({ row }) =>
          row.original.targetType
            ? `${row.original.targetType}:${row.original.targetId ?? '—'}`
            : '—',
      },
      {
        header: t('audit.columns.actor'),
        id: 'actor',
        cell: ({ row }) => row.original.actorId ?? row.original.actorType,
      },
      {
        header: t('audit.columns.ip'),
        accessorKey: 'ipAddress',
        cell: ({ row }) => row.original.ipAddress ?? '—',
      },
    ],
    [t],
  )

  const handleResolve = async () => {
    if (!resolveTarget) return
    try {
      setResolving(true)
      const ok = await AdminModerationService.resolveReport(resolveTarget.id, {
        status: resolveStatus,
        adminNote: adminNote.trim() || undefined,
        suspendReportedUser: suspendUser,
      })
      if (ok) {
        toast.push(<Notification type="success">{t('reports.resolveSuccess')}</Notification>)
        setResolveTarget(null)
        setAdminNote('')
        setSuspendUser(false)
        loadReports()
        loadAudit()
      }
    } catch (e) {
      console.error(e)
      toast.push(<Notification type="danger">{t('reports.resolveError')}</Notification>)
    } finally {
      setResolving(false)
    }
  }

  const handleSaveRateLimits = async () => {
    if (!rateLimits) return
    try {
      setRateSaving(true)
      const updated = await AdminModerationService.updateRateLimits(rateLimits)
      if (updated) {
        setRateLimits(updated)
        toast.push(<Notification type="success">{t('rateLimits.saveSuccess')}</Notification>)
        loadAudit()
      }
    } catch (e) {
      console.error(e)
      toast.push(<Notification type="danger">{t('rateLimits.saveError')}</Notification>)
    } finally {
      setRateSaving(false)
    }
  }

  const statusOptions = [
    { value: '', label: t('reports.filterAll') },
    { value: 'pending', label: t('reports.statuses.pending') },
    { value: 'resolved', label: t('reports.statuses.resolved') },
    { value: 'dismissed', label: t('reports.statuses.dismissed') },
  ]

  return (
    <div className="flex flex-col gap-4">
      <AdaptiveCard>
        <h3 className="heading-text mb-1">{t('title')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
      </AdaptiveCard>

      <AdaptiveCard>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h4 className="heading-text mb-1">{t('reports.title')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.hint')}</p>
          </div>
          <div className="w-48">
            <Select
              size="sm"
              options={statusOptions}
              value={statusOptions.find(o => o.value === statusFilter)}
              onChange={opt => setStatusFilter((opt?.value as UserReportStatus | '') ?? '')}
            />
          </div>
        </div>
        {reportsLoading ? (
          <p className="text-gray-500">{tCommon('loading')}</p>
        ) : (
          <DataTable
            data={reports}
            columns={reportColumns}
            pagingData={{ total: reports.length, pageIndex: 1, pageSize: reports.length || 10 }}
            noData={reports.length === 0}
          />
        )}
      </AdaptiveCard>

      <AdaptiveCard>
        <h4 className="heading-text mb-1">{t('rateLimits.title')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('rateLimits.hint')}</p>
        {rateLoading || !rateLimits ? (
          <p className="text-gray-500">{tCommon('loading')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                {t('rateLimits.ttlMs')}
              </span>
              <Input
                type="number"
                min={5000}
                max={300000}
                step={1000}
                value={String(rateLimits.ttlMs)}
                onChange={e =>
                  setRateLimits({ ...rateLimits, ttlMs: Number(e.target.value) })
                }
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                {t('rateLimits.maxRequests')}
              </span>
              <Input
                type="number"
                min={10}
                max={1000}
                value={String(rateLimits.maxRequests)}
                onChange={e =>
                  setRateLimits({ ...rateLimits, maxRequests: Number(e.target.value) })
                }
              />
            </label>
            <div className="md:col-span-2">
              <Button variant="solid" loading={rateSaving} onClick={handleSaveRateLimits}>
                {t('rateLimits.save')}
              </Button>
            </div>
          </div>
        )}
      </AdaptiveCard>

      <AdaptiveCard>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h4 className="heading-text mb-1">{t('audit.title')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('audit.hint')}</p>
          </div>
          <Input
            className="max-w-xs"
            placeholder={t('audit.actionFilter')}
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          />
          <Button variant="default" size="sm" onClick={loadAudit}>
            {t('audit.refresh')}
          </Button>
        </div>
        {auditLoading ? (
          <p className="text-gray-500">{tCommon('loading')}</p>
        ) : (
          <DataTable
            data={auditLogs}
            columns={auditColumns}
            pagingData={{ total: auditLogs.length, pageIndex: 1, pageSize: auditLogs.length || 10 }}
            noData={auditLogs.length === 0}
          />
        )}
      </AdaptiveCard>

      <Dialog
        isOpen={resolveTarget !== null}
        onClose={() => setResolveTarget(null)}
        onRequestClose={() => setResolveTarget(null)}
      >
        <h4 className="heading-text mb-2">{t('reports.resolveTitle')}</h4>
        <p className="text-sm text-gray-500 mb-4">{resolveTarget?.details ?? '—'}</p>
        <div className="flex gap-2 mb-4">
          <Button
            variant={resolveStatus === 'resolved' ? 'solid' : 'default'}
            size="sm"
            onClick={() => setResolveStatus('resolved')}
          >
            {t('reports.resolve')}
          </Button>
          <Button
            variant={resolveStatus === 'dismissed' ? 'solid' : 'default'}
            size="sm"
            onClick={() => setResolveStatus('dismissed')}
          >
            {t('reports.dismiss')}
          </Button>
        </div>
        <Input
          textArea
          rows={3}
          className="mb-3"
          placeholder={t('reports.adminNotePlaceholder')}
          value={adminNote}
          onChange={e => setAdminNote(e.target.value)}
        />
        <div className="flex items-center gap-2 mb-4">
          <Switcher checked={suspendUser} onChange={setSuspendUser} />
          <span className="text-sm">{t('reports.suspendOnResolve')}</span>
        </div>
        <Button variant="solid" loading={resolving} onClick={handleResolve}>
          {tCommon('confirm')}
        </Button>
      </Dialog>
    </div>
  )
}
