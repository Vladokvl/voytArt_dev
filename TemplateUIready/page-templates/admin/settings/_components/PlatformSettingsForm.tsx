'use client'

import { useCallback, useEffect, useState } from 'react'
import { TbPlus, TbX } from 'react-icons/tb'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import { Input, Select, Switcher, Tag } from '@/components/ui'
import { toast } from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { AdminSettingsService } from '@/services/admin/AdminSettingsService'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminPlatformSettings } from '@/@types/adminSettings'
import { NETWORK_RECALC_INTERVAL_OPTIONS } from '@/@types/adminSettings'

export default function PlatformSettingsForm() {
  const t = useTranslation('admin.settings')
  const tCommon = useTranslation('common')

  const [form, setForm] = useState<AdminPlatformSettings | null>(null)
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await AdminSettingsService.getSettings()

      if (!data) {
        setError(t('loadError'))
        return
      }

      setForm(data)
    } catch (err) {
      console.error('Failed to load platform settings:', err)
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  const handleSave = async () => {
    if (!form) {
      return
    }

    try {
      setSaving(true)
      const updated = await AdminSettingsService.updateSettings(form)

      if (updated) {
        setForm(updated)
        toast.push(
          <Notification type="success">{t('saveSuccess')}</Notification>,
        )
      }
    } catch (err) {
      console.error('Failed to save platform settings:', err)
      toast.push(
        <Notification type="danger">{t('saveError')}</Notification>,
      )
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    const trimmed = newTag.trim()

    if (!form || !trimmed) {
      return
    }

    if (form.universeTags.includes(trimmed)) {
      setNewTag('')
      return
    }

    setForm({
      ...form,
      universeTags: [...form.universeTags, trimmed],
    })
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    if (!form) {
      return
    }

    setForm({
      ...form,
      universeTags: form.universeTags.filter(item => item !== tag),
    })
  }

  const intervalOptions = NETWORK_RECALC_INTERVAL_OPTIONS.map(hours => ({
    value: hours,
    label: t(`syncFrequencyOptions.${hours}`),
  }))

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
        <h4 className="heading-text mb-1">{t('inviteOnlyTitle')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('inviteOnlyHint')}
        </p>
        <div className="flex items-center gap-3">
          <Switcher
            checked={form.inviteRequired}
            onChange={checked =>
              setForm({ ...form, inviteRequired: checked })
            }
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {form.inviteRequired ? t('inviteOnlyOn') : t('inviteOnlyOff')}
          </span>
        </div>
      </AdaptiveCard>

      <AdaptiveCard>
        <h4 className="heading-text mb-1">{t('universeTagsTitle')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('universeTagsHint')}
        </p>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
          {form.universeTags.length === 0 ? (
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {t('universeTagsEmpty')}
            </span>
          ) : (
            form.universeTags.map(tag => (
              <Tag
                key={tag}
                className="inline-flex items-center gap-1 bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200 border-0 text-xs"
              >
                {tag}
                <button
                  type="button"
                  className="p-0.5 rounded hover:bg-violet-200/80 dark:hover:bg-violet-800/60"
                  aria-label={t('removeTag', { tag })}
                  onClick={() => removeTag(tag)}
                >
                  <TbX className="w-3.5 h-3.5" />
                </button>
              </Tag>
            ))
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            className="max-w-xs flex-1 min-w-[12rem]"
            placeholder={t('universeTagPlaceholder')}
            value={newTag}
            maxLength={64}
            onChange={event => setNewTag(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addTag()
              }
            }}
          />
          <Button
            type="button"
            variant="default"
            icon={<TbPlus />}
            disabled={!newTag.trim()}
            onClick={addTag}
          >
            {t('addTag')}
          </Button>
        </div>
      </AdaptiveCard>

      <AdaptiveCard>
        <h4 className="heading-text mb-1">{t('syncFrequencyTitle')}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('syncFrequencyHint')}
        </p>
        <div className="max-w-sm">
          <Select
            options={intervalOptions}
            value={intervalOptions.find(
              option => option.value === form.networkRecalcIntervalHours,
            )}
            onChange={option => {
              if (!option) {
                return
              }

              setForm({
                ...form,
                networkRecalcIntervalHours: option.value as number,
              })
            }}
          />
        </div>
      </AdaptiveCard>

      <AdaptiveCard>
        <div className="flex flex-wrap gap-3">
          <Button variant="solid" loading={saving} onClick={handleSave}>
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
