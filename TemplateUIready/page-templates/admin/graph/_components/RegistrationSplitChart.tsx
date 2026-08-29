'use client'

import Chart from '@/components/shared/Chart'
import { COLORS } from '@/constants/chart.constant'
import useTranslation from '@/utils/hooks/useTranslation'

type RegistrationSplitChartProps = {
  registered: number
  unregistered: number
  total: number
}

export default function RegistrationSplitChart({
  registered,
  unregistered,
  total,
}: RegistrationSplitChartProps) {
  const t = useTranslation('admin.graph')

  const legendItems = [
    {
      label: t('status.registered'),
      value: registered,
      color: COLORS[1],
    },
    {
      label: t('status.unregistered'),
      value: unregistered,
      color: COLORS[2],
    },
  ]

  return (
    <div>
      <Chart
        type="donut"
        series={[registered, unregistered]}
        height={260}
        donutTitle={t('donutCenterLabel')}
        donutText={total.toLocaleString()}
        customOptions={{
          labels: [t('status.registered'), t('status.unregistered')],
          colors: [COLORS[1], COLORS[2]],
        }}
      />

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
        {legendItems.map(item => (
          <li key={item.label} className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            <span className="font-semibold heading-text tabular-nums">
              {item.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
