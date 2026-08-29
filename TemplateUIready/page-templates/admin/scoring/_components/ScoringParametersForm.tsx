'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui'
import { toast } from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { AdminScoringService } from '@/services/admin'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminScoringParameters } from '@/@types/adminScoring'

type FieldKey = keyof AdminScoringParameters

const WEIGHT_FIELDS: FieldKey[] = [
  'relativeOverlapWeightPct',
  'rawOverlapWeightPct',
  'qualityWeightPct',
  'clusterCoherenceWeightPct',
]

const THRESHOLD_FIELDS: FieldKey[] = [
  'minMutualContactsMasked',
  'universalContactThresholdPct',
  'inviteClusterCoherenceThresholdPct',
]

export default function ScoringParametersForm() {
  const t = useTranslation('admin.scoring')
  const tCommon = useTranslation('common')

  const [form, setForm] = useState<AdminScoringParameters | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await AdminScoringService.getParameters()

      if (!data) {
        setError(t('loadError'))
        return
      }

      setForm(data)
    } catch (err) {
      console.error('Failed to load scoring parameters:', err)
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  const weightsSum = useMemo(() => {
    if (!form) {
      return 0
    }

    return (
      form.relativeOverlapWeightPct +
      form.rawOverlapWeightPct +
      form.qualityWeightPct +
      form.clusterCoherenceWeightPct
    )
  }, [form])

  const weightsValid = Math.abs(weightsSum - 100) < 0.01

  const handleChange = (key: FieldKey, raw: string) => {
    const parsed = Number(raw)

    if (!form || !Number.isFinite(parsed)) {
      return
    }

    setForm({ ...form, [key]: parsed })
  }

  const handleSave = async () => {
    if (!form) {
      return
    }

    if (!weightsValid) {
      toast.push(
        <Notification type="warning">{t('weightsSumError')}</Notification>,
      )
      return
    }

    try {
      setSaving(true)
      const updated = await AdminScoringService.updateParameters(form)

      if (updated) {
        setForm(updated)
        toast.push(
          <Notification type="success">{t('saveSuccess')}</Notification>,
        )
      }
    } catch (err) {
      console.error('Failed to save scoring parameters:', err)
      toast.push(
        <Notification type="danger">{t('saveError')}</Notification>,
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdaptiveCard>
        <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
      </AdaptiveCard>
    )
  }

  if (error || !form) {
    return (
      <AdaptiveCard>
        <h3 className="heading-text mb-2">{t('errorTitle')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{error ?? t('loadError')}</p>
      </AdaptiveCard>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <AdaptiveCard>
        <h3 className="heading-text mb-1">{t('title')}</h3>
        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
      </AdaptiveCard>

      <AdaptiveCard>
        <h4 className="heading-text mb-1">{t('weightsTitle')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('weightsHint')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEIGHT_FIELDS.map(key => (
            <label key={key} className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                {t(`fields.${key}`)}
              </span>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={String(form[key])}
                onChange={event => handleChange(key, event.target.value)}
              />
            </label>
          ))}
        </div>
        <p
          className={`text-sm mt-3 ${weightsValid ? 'text-gray-500 dark:text-gray-400' : 'text-amber-600 dark:text-amber-400'}`}
        >
          {t('weightsSum', { sum: weightsSum.toFixed(1) })}
        </p>
      </AdaptiveCard>

      <AdaptiveCard>
        <h4 className="heading-text mb-1">{t('thresholdsTitle')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('thresholdsHint')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THRESHOLD_FIELDS.map(key => (
            <label key={key} className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                {t(`fields.${key}`)}
              </span>
              <Input
                type="number"
                min={key === 'minMutualContactsMasked' ? 1 : 0}
                max={100}
                step={key === 'minMutualContactsMasked' ? 1 : 0.1}
                value={String(form[key])}
                onChange={event => handleChange(key, event.target.value)}
              />
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                {t(`fieldsHint.${key}`)}
              </span>
            </label>
          ))}
        </div>
      </AdaptiveCard>

      <AdaptiveCard>
        <div className="flex flex-wrap gap-3">
          <Button variant="solid" loading={saving} disabled={!weightsValid} onClick={handleSave}>
            {t('save')}
          </Button>
          <Button variant="default" disabled={saving} onClick={load}>
            {t('reset')}
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">{t('saveNote')}</p>
      </AdaptiveCard>
    </div>
  )
}
