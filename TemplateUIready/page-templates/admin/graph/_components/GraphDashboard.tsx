'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { Input } from '@/components/ui'
import { AdminGraphService } from '@/services/admin'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminGraphDashboardData } from '@/@types/adminGraph'
import ClusterVisualization from './ClusterVisualization'
import RegistrationSplitChart from './RegistrationSplitChart'
import ClustersTable from './ClustersTable'
import FrequentHashesTable from './FrequentHashesTable'
import HashExplorer from './HashExplorer'

export default function GraphDashboard() {
  const t = useTranslation('admin.graph')
  const tCommon = useTranslation('common')

  const [threshold, setThreshold] = useState(3)
  const [thresholdInput, setThresholdInput] = useState('3')
  const [data, setData] = useState<AdminGraphDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHash, setSelectedHash] = useState<string | null>(null)
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null)

  const fetchData = useCallback(async (activeThreshold: number) => {
    try {
      setLoading(true)
      setError(null)
      const result = await AdminGraphService.getDashboard(activeThreshold)
      setData(result)

      if (result?.clusters.clusters.length) {
        setSelectedClusterId(result.clusters.clusters[0].clusterId)
      }
    } catch (err) {
      console.error('Failed to load graph analytics:', err)
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = Number(thresholdInput)

      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 100) {
        setThreshold(parsed)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [thresholdInput])

  useEffect(() => {
    fetchData(threshold)
  }, [fetchData, threshold])

  if (loading && !data) {
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

  const { overview, frequentHashes, clusters } = data

  const metrics = [
    {
      label: t('metrics.uniqueHashes'),
      value: overview.uniqueHashes.toLocaleString(),
    },
    {
      label: t('metrics.registered'),
      value: overview.registeredHashes.toLocaleString(),
    },
    {
      label: t('metrics.unregistered'),
      value: overview.unregisteredHashes.toLocaleString(),
    },
    {
      label: t('metrics.universalContacts'),
      value: overview.universalContactsCount.toLocaleString(),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <AdaptiveCard>
        <h3 className="heading-text mb-1">{t('title')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
      </AdaptiveCard>

      <AdaptiveCard>
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
          {t('universalThresholdLabel')}
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="number"
            min={1}
            max={100}
            value={thresholdInput}
            onChange={event => setThresholdInput(event.target.value)}
            className="max-w-[120px]"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('universalThresholdHint', {
              default: overview.defaultUniversalThresholdPct,
            })}
          </span>
        </div>
      </AdaptiveCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <AdaptiveCard key={metric.label}>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
            <div className="text-2xl font-semibold heading-text">{metric.value}</div>
          </AdaptiveCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AdaptiveCard>
          <h4 className="heading-text mb-4">{t('registrationSplitTitle')}</h4>
          <RegistrationSplitChart
            registered={overview.registeredHashes}
            unregistered={overview.unregisteredHashes}
            total={overview.uniqueHashes}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {t('phonebookEntriesHint', { count: overview.totalPhonebookEntries })}
          </p>
        </AdaptiveCard>

        <AdaptiveCard>
          <h4 className="heading-text mb-4">{t('frequentHashesTitle')}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('frequentHashesHint')}</p>
          <FrequentHashesTable
            items={frequentHashes}
            onSelectHash={hash => setSelectedHash(hash)}
          />
        </AdaptiveCard>
      </div>

      <HashExplorer
        threshold={threshold}
        initialHash={selectedHash}
        onHashSelect={setSelectedHash}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AdaptiveCard>
          <h4 className="heading-text mb-4">{t('clustersTitle')}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('clustersHint')}</p>
          <ClustersTable
            items={clusters.clusters}
            onSelectCluster={setSelectedClusterId}
          />
        </AdaptiveCard>

        <AdaptiveCard>
          <h4 className="heading-text mb-4">{t('clusterVizTitle')}</h4>
          <ClusterVisualization
            clusters={clusters.clusters}
            links={clusters.links}
            selectedClusterId={selectedClusterId}
          />
        </AdaptiveCard>
      </div>
    </div>
  )
}
