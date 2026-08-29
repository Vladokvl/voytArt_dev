'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import DataTable from '@/components/shared/DataTable'
import Button from '@/components/ui/Button'
import { Switcher } from '@/components/ui'
import { toast } from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { AdminNotificationsService } from '@/services/admin/AdminNotificationsService'
import useTranslation from '@/utils/hooks/useTranslation'
import type { NotificationHistoryItem } from '@/@types/adminNotifications'
import { DATE_FORMATS, formatDate } from '@/utils/dateDisplay'

export default function NotificationsDashboard() {
  const t = useTranslation('admin.notifications')
  const tCommon = useTranslation('common')

  const [contactRegistered, setContactRegistered] = useState(true)
  const [triggersLoading, setTriggersLoading] = useState(true)
  const [triggersSaving, setTriggersSaving] = useState(false)

  const [history, setHistory] = useState<NotificationHistoryItem[]>([])
  const [summary, setSummary] = useState<{
    openRatePct: number
    totalSent: number
    totalOpened: number
    contactOpenRatePct: number
  } | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  const loadTriggers = useCallback(async () => {
    try {
      setTriggersLoading(true)
      const data = await AdminNotificationsService.getTriggers()
      if (data) setContactRegistered(data.contactRegistered)
    } catch (e) {
      console.error(e)
    } finally {
      setTriggersLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true)
      const res = await AdminNotificationsService.getHistory({ limit: 50, page: 1 })
      if (res?.data) {
        setHistory(res.data.items)
        setSummary({
          openRatePct: res.data.summary.openRatePct,
          totalSent: res.data.summary.totalSent,
          totalOpened: res.data.summary.totalOpened,
          contactOpenRatePct:
            res.data.summary.byTrigger.contactRegistered.openRatePct,
        })
      }
    } catch (e) {
      console.error(e)
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTriggers()
    loadHistory()
  }, [loadTriggers, loadHistory])

  const handleSaveTriggers = async () => {
    try {
      setTriggersSaving(true)
      const updated = await AdminNotificationsService.updateTriggers({
        contactRegistered,
      })
      if (updated) {
        setContactRegistered(updated.contactRegistered)
        toast.push(
          <Notification type="success">{t('triggers.saveSuccess')}</Notification>,
        )
      }
    } catch (e) {
      console.error(e)
      toast.push(
        <Notification type="danger">{t('triggers.saveError')}</Notification>,
      )
    } finally {
      setTriggersSaving(false)
    }
  }

  const columns = useMemo<ColumnDef<NotificationHistoryItem>[]>(
    () => [
      {
        header: t('history.columns.date'),
        accessorKey: 'createdAt',
        cell: ({ row }) => formatDate(row.original.createdAt, DATE_FORMATS.MEDIUM),
      },
      {
        header: t('history.columns.trigger'),
        accessorKey: 'triggerType',
        cell: ({ row }) => t(`triggers.types.${row.original.triggerType}` as string),
      },
      {
        header: t('history.columns.recipient'),
        id: 'recipient',
        cell: ({ row }) =>
          row.original.recipient.name ?? row.original.recipient.email ?? '—',
      },
      {
        header: t('history.columns.contact'),
        id: 'contact',
        cell: ({ row }) => row.original.contactName ?? '—',
      },
      {
        header: t('history.columns.delivered'),
        id: 'delivered',
        cell: ({ row }) =>
          `${row.original.deliveredCount}/${row.original.deviceCount}`,
      },
      {
        header: t('history.columns.opened'),
        id: 'opened',
        cell: ({ row }) =>
          row.original.opened ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              {t('history.openedYes')}
            </span>
          ) : (
            <span className="text-gray-400">{t('history.openedNo')}</span>
          ),
      },
    ],
    [t],
  )

  return (
    <div className="flex flex-col gap-4">
      <AdaptiveCard>
        <h3 className="heading-text mb-1">{t('title')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
      </AdaptiveCard>

      <AdaptiveCard>
        <h4 className="heading-text mb-1">{t('triggers.title')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('triggers.hint')}
        </p>
        {triggersLoading ? (
          <p className="text-gray-500">{tCommon('loading')}</p>
        ) : (
          <div className="flex flex-col gap-4 max-w-lg">
            <div className="flex items-start gap-3">
              <Switcher
                checked={contactRegistered}
                onChange={setContactRegistered}
              />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t('triggers.contactRegistered')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('triggers.contactRegisteredHint')}
                </p>
              </div>
            </div>
            <Button variant="solid" loading={triggersSaving} onClick={handleSaveTriggers}>
              {t('triggers.save')}
            </Button>
          </div>
        )}
      </AdaptiveCard>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdaptiveCard>
            <p className="text-sm text-gray-500">{t('stats.totalSent')}</p>
            <p className="text-2xl heading-text mt-1">{summary.totalSent}</p>
          </AdaptiveCard>
          <AdaptiveCard>
            <p className="text-sm text-gray-500">{t('stats.totalOpened')}</p>
            <p className="text-2xl heading-text mt-1">{summary.totalOpened}</p>
          </AdaptiveCard>
          <AdaptiveCard>
            <p className="text-sm text-gray-500">{t('stats.openRate')}</p>
            <p className="text-2xl heading-text mt-1">{summary.openRatePct}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {t('stats.contactOpenRate', { rate: summary.contactOpenRatePct })}
            </p>
          </AdaptiveCard>
        </div>
      )}

      <AdaptiveCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="heading-text mb-1">{t('history.title')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('history.hint')}</p>
          </div>
          <Button variant="default" size="sm" onClick={loadHistory}>
            {t('history.refresh')}
          </Button>
        </div>
        {historyLoading ? (
          <p className="text-gray-500">{tCommon('loading')}</p>
        ) : (
          <DataTable
            data={history}
            columns={columns}
            pagingData={{
              total: history.length,
              pageIndex: 1,
              pageSize: history.length || 10,
            }}
            noData={history.length === 0}
          />
        )}
      </AdaptiveCard>
    </div>
  )
}
