'use client'

import { useMemo } from 'react'
import Chart from '@/components/shared/Chart'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminGraphCluster, AdminGraphClusterLink } from '@/@types/adminGraph'

type ClusterVisualizationProps = {
  clusters: AdminGraphCluster[]
  links: AdminGraphClusterLink[]
  selectedClusterId?: number | null
}

function layoutCluster(
  cluster: AdminGraphCluster,
  width: number,
  height: number,
) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35

  return cluster.members.map((member, index) => {
    const angle = (2 * Math.PI * index) / cluster.members.length - Math.PI / 2

    return {
      ...member,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })
}

export default function ClusterVisualization({
  clusters,
  links,
  selectedClusterId,
}: ClusterVisualizationProps) {
  const t = useTranslation('admin.graph')

  const topClusters = useMemo(
    () => [...clusters].sort((a, b) => b.memberCount - a.memberCount).slice(0, 15),
    [clusters],
  )

  const chartCategories = useMemo(
    () => topClusters.map(cluster => `#${cluster.clusterId}`),
    [topClusters],
  )

  const chartSeries = useMemo(
    () => [
      {
        name: t('clusterChartSeries'),
        data: topClusters.map(cluster => cluster.memberCount),
      },
    ],
    [topClusters, t],
  )

  const selectedCluster = useMemo(() => {
    if (selectedClusterId == null) {
      return topClusters[0] ?? null
    }

    return clusters.find(cluster => cluster.clusterId === selectedClusterId) ?? null
  }, [clusters, selectedClusterId, topClusters])

  const positionedMembers = useMemo(() => {
    if (!selectedCluster) {
      return []
    }

    return layoutCluster(selectedCluster, 420, 280)
  }, [selectedCluster])

  const memberPositions = useMemo(
    () => new Map(positionedMembers.map(member => [member.userId, member])),
    [positionedMembers],
  )

  const clusterLinks = useMemo(() => {
    if (!selectedCluster) {
      return []
    }

    const memberIds = new Set(selectedCluster.members.map(member => member.userId))

    return links.filter(
      link =>
        memberIds.has(link.sourceUserId) && memberIds.has(link.targetUserId),
    )
  }, [links, selectedCluster])

  if (clusters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h5 className="heading-text text-sm mb-3">{t('clusterSizeChartTitle')}</h5>
        <Chart type="bar" series={chartSeries} xAxis={chartCategories} height={240} />
      </div>

      {selectedCluster && (
        <div>
          <h5 className="heading-text text-sm mb-1">
            {t('clusterNetworkTitle', { id: selectedCluster.clusterId })}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {t('clusterNetworkHint', { count: selectedCluster.memberCount })}
          </p>
          <svg
            viewBox="0 0 420 280"
            width="100%"
            height="280"
            preserveAspectRatio="xMidYMid meet"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
            role="img"
            aria-label={t('clusterNetworkTitle', { id: selectedCluster.clusterId })}
          >
            {clusterLinks.map(link => {
              const source = memberPositions.get(link.sourceUserId)
              const target = memberPositions.get(link.targetUserId)

              if (!source || !target) {
                return null
              }

              return (
                <line
                  key={`${link.sourceUserId}-${link.targetUserId}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="currentColor"
                  className="text-gray-300 dark:text-gray-600"
                  strokeWidth={1}
                />
              )
            })}
            {positionedMembers.map(member => (
              <g key={member.userId}>
                <circle
                  cx={member.x}
                  cy={member.y}
                  r={14}
                  className="fill-primary/20 stroke-primary"
                  strokeWidth={2}
                />
                <text
                  x={member.x}
                  y={member.y + 28}
                  textAnchor="middle"
                  className="fill-gray-600 dark:fill-gray-300 text-[9px]"
                >
                  {(member.name || member.maskedCode || member.userId).slice(0, 12)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  )
}
