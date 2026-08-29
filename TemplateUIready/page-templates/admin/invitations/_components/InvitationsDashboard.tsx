'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Chart from '@/components/shared/Chart'
import { AdminInvitationsService } from '@/services/admin'
import useTranslation from '@/utils/hooks/useTranslation'
import { coerceNumber, formatPercent } from '@/utils/number'
import type { AdminInvitationsDashboardData } from '@/@types/adminInvitations'
import InvitationChainsTable from './InvitationChainsTable'
import TopInvitersTable from './TopInvitersTable'

function formatDelay(seconds: unknown): string {
  const value = coerceNumber(seconds)
  if (value == null) {
    return '—'
  }

  if (value < 3600) {
    return `${Math.max(1, Math.round(value / 60))} min`
  }

  if (value < 86400) {
    return `${Math.round(value / 3600)} h`
  }

  return `${Math.round(value / 86400)} d`
}

export default function InvitationsDashboard() {
  const t = useTranslation('admin.invitations')
  const tCommon = useTranslation('common')

  const [data, setData] = useState<AdminInvitationsDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await AdminInvitationsService.getDashboard(30)
      setData(result)
    } catch (err) {
      console.error('Failed to load invitation analytics:', err)
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const chartCategories = useMemo(
    () => data?.daily.map(point => dayjs(point.date).format('DD.MM')) ?? [],
    [data?.daily],
  )

  const chartSeries = useMemo(
    () => [
      {
        name: t('chartSeries'),
        data: data?.daily.map(point => point.count) ?? [],
      },
    ],
    [data?.daily, t],
  )

  if (loading) {
    return (
      <AdaptiveCard>
        <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
      </AdaptiveCard>
    )
  }

  if (error || !data) {
    return (
      <AdaptiveCard>
        <h3 className="heading-text mb-2">{t('errorTitle')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{error ?? t('loadError')}</p>
      </AdaptiveCard>
    )
  }

  const { overview, topInviters, chains } = data

  const metrics = [
    {
      label: t('metrics.totalSent'),
      value: (coerceNumber(overview.totalSent) ?? 0).toLocaleString(),
    },
    {
      label: t('metrics.conversionRate'),
      value: formatPercent(overview.conversionRate),
    },
    {
      label: t('metrics.avgDelay'),
      value: formatDelay(overview.avgDelaySeconds),
    },
    {
      label: t('metrics.accepted'),
      value: (coerceNumber(overview.accepted) ?? 0).toLocaleString(),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <AdaptiveCard>
        <h3 className="heading-text mb-1">{t('title')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
      </AdaptiveCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <AdaptiveCard key={metric.label}>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
            <div className="text-2xl font-semibold heading-text">{metric.value}</div>
          </AdaptiveCard>
        ))}
      </div>

      <AdaptiveCard>
        <h4 className="heading-text mb-4">{t('dailyChartTitle')}</h4>
        <Chart type="area" series={chartSeries} xAxis={chartCategories} height={280} />
      </AdaptiveCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AdaptiveCard>
          <h4 className="heading-text mb-4">{t('topInvitersTitle')}</h4>
          <TopInvitersTable items={topInviters} />
        </AdaptiveCard>

        <AdaptiveCard>
          <h4 className="heading-text mb-4">{t('chainsTitle')}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('chainsHint')}</p>
          <InvitationChainsTable items={chains} />
        </AdaptiveCard>
      </div>
    </div>
  )
}
