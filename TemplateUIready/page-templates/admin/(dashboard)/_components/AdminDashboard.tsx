'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Chart from '@/components/shared/Chart'
import { AdminDashboardService } from '@/services/admin'
import useTranslation from '@/utils/hooks/useTranslation'
import { coerceNumber, formatPercent } from '@/utils/number'
import type { AdminDashboardData } from '@/@types/adminDashboard'

export default function AdminDashboard() {
  const t = useTranslation('admin.dashboard')
  const tCommon = useTranslation('common')

  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await AdminDashboardService.getDashboard(30)
      setData(result)
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err)
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const chartCategories = useMemo(
    () => data?.dailySignups.map(point => dayjs(point.date).format('DD.MM')) ?? [],
    [data?.dailySignups],
  )

  const chartSeries = useMemo(
    () => [
      {
        name: t('chartSeries'),
        data: data?.dailySignups.map(point => point.count) ?? [],
      },
    ],
    [data?.dailySignups, t],
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

  const { overview } = data

  const primaryMetrics = [
    {
      label: t('metrics.totalUsers'),
      value: (coerceNumber(overview.totalUsers) ?? 0).toLocaleString(),
    },
    {
      label: t('metrics.dau'),
      value: (coerceNumber(overview.dau) ?? 0).toLocaleString(),
    },
    {
      label: t('metrics.mau'),
      value: (coerceNumber(overview.mau) ?? 0).toLocaleString(),
    },
    {
      label: t('metrics.importRate'),
      value: formatPercent(overview.importRate),
    },
  ]

  const retentionMetrics = [
    {
      label: t('metrics.retentionD1'),
      value: formatPercent(overview.retentionD1),
    },
    {
      label: t('metrics.retentionD7'),
      value: formatPercent(overview.retentionD7),
    },
    {
      label: t('metrics.retentionD30'),
      value: formatPercent(overview.retentionD30),
    },
  ]

  const contactMetrics = [
    {
      label: t('metrics.totalContactsImported'),
      value: (coerceNumber(overview.totalContactsImported) ?? 0).toLocaleString(),
    },
    {
      label: t('metrics.avgContactsPerUser'),
      value: (coerceNumber(overview.avgContactsPerUser) ?? 0).toLocaleString(),
    },
    {
      label: t('metrics.usersWithImports'),
      value: (coerceNumber(overview.usersWithImports) ?? 0).toLocaleString(),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <AdaptiveCard>
        <h3 className="heading-text mb-1">{t('title')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
      </AdaptiveCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {primaryMetrics.map(metric => (
          <AdaptiveCard key={metric.label}>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
            <div className="text-2xl font-semibold heading-text">{metric.value}</div>
          </AdaptiveCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {retentionMetrics.map(metric => (
          <AdaptiveCard key={metric.label}>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
            <div className="text-2xl font-semibold heading-text">{metric.value}</div>
          </AdaptiveCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMetrics.map(metric => (
          <AdaptiveCard key={metric.label}>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
            <div className="text-2xl font-semibold heading-text">{metric.value}</div>
          </AdaptiveCard>
        ))}
      </div>

      <AdaptiveCard>
        <h4 className="heading-text mb-1">{t('signupsChartTitle')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('signupsChartHint')}</p>
        <Chart type="area" series={chartSeries} xAxis={chartCategories} height={280} />
      </AdaptiveCard>
    </div>
  )
}
