'use client'

import type { ReactNode } from 'react'
import {
  TbAddressBook,
  TbBriefcase,
  TbClock,
  TbMail,
  TbMapPin,
  TbSend,
  TbUserCheck,
  TbUsers,
} from 'react-icons/tb'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { Tag } from '@/components/ui'
import useTranslation from '@/utils/hooks/useTranslation'
import type { AdminUserDetail } from '@/@types/adminUsers'
import { DATE_FORMATS, formatDate } from '@/utils/dateDisplay'

type TranslateFn = (key: string) => string

function DetailSubsection({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200/80 dark:border-gray-700/80">
        <span className="text-gray-500 dark:text-gray-400">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

function DetailField({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{children}</dd>
    </div>
  )
}

function EmptyValue({ t }: { t: TranslateFn }) {
  return <span className="text-gray-400 dark:text-gray-500 font-normal">{t('users.notProvided')}</span>
}

function StatTile({
  label,
  value,
  icon,
  accentClass,
}: {
  label: string
  value: number | string
  icon: ReactNode
  accentClass: string
}) {
  return (
    <div
      className={`rounded-lg border p-3 flex flex-col gap-2 ${accentClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{label}</span>
        <span className="shrink-0 opacity-70">{icon}</span>
      </div>
      <span className="text-2xl font-semibold tabular-nums heading-text">{value}</span>
    </div>
  )
}

export function UserProfileSection({ user }: { user: AdminUserDetail }) {
  const t = useTranslation('admin')
  const notProvided = <EmptyValue t={t} />
  const tags = user.tags?.length ? user.tags : user.universe?.split(',').map(s => s.trim()).filter(Boolean)

  return (
    <AdaptiveCard>
      <h3 className="text-base font-semibold mb-4 heading-text">{t('users.sections.profile')}</h3>
      <div className="flex flex-col gap-3">
        <DetailSubsection title={t('users.profile.contactGroup')} icon={<TbMail className="text-lg" />}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <DetailField label={t('users.contact.email')}>
              {user.email ? (
                <a href={`mailto:${user.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {user.email}
                </a>
              ) : (
                notProvided
              )}
            </DetailField>
            <DetailField label={t('users.columns.partialNumber')}>
              {user.partialNumber ? (
                <span className="font-mono tracking-wide">{user.partialNumber}</span>
              ) : (
                notProvided
              )}
            </DetailField>
          </dl>
        </DetailSubsection>

        <DetailSubsection title={t('users.profile.locationGroup')} icon={<TbMapPin className="text-lg" />}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <DetailField label={t('users.columns.city')}>
              {user.city || user.country || notProvided}
            </DetailField>
            <DetailField label={t('users.profile.country')}>
              {user.country || notProvided}
            </DetailField>
            <DetailField label={t('users.profile.address')} className="sm:col-span-2">
              {user.address || notProvided}
            </DetailField>
          </dl>
        </DetailSubsection>

        <DetailSubsection title={t('users.profile.professionalGroup')} icon={<TbBriefcase className="text-lg" />}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-3">
            <DetailField label={t('users.profile.jobRole')}>
              {user.jobRole || notProvided}
            </DetailField>
            <DetailField label={t('users.profile.industry')}>
              {user.industry || notProvided}
            </DetailField>
          </dl>
          <DetailField label={t('users.columns.universe')}>
            {tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    className="bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200 border-0 text-xs"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            ) : (
              notProvided
            )}
          </DetailField>
        </DetailSubsection>
      </div>
    </AdaptiveCard>
  )
}

export function UserNetworkSection({ user }: { user: AdminUserDetail }) {
  const t = useTranslation('admin')
  const { stats } = user
  const conversionPct =
    stats.invitationsSent > 0
      ? Math.round((stats.invitationsConverted / stats.invitationsSent) * 100)
      : null

  return (
    <AdaptiveCard>
      <h3 className="text-base font-semibold mb-4 heading-text">{t('users.sections.activity')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <StatTile
          label={t('users.stats.contactsImportedShort')}
          value={stats.contactsImported}
          icon={<TbAddressBook className="text-xl" />}
          accentClass="border-blue-200/80 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/30"
        />
        <StatTile
          label={t('users.stats.contactsRegisteredShort')}
          value={stats.contactsRegistered}
          icon={<TbUsers className="text-xl" />}
          accentClass="border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
        />
        <StatTile
          label={t('users.stats.invitationsSentShort')}
          value={stats.invitationsSent}
          icon={<TbSend className="text-xl" />}
          accentClass="border-amber-200/80 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/30"
        />
        <StatTile
          label={t('users.stats.invitationsConvertedShort')}
          value={
            conversionPct !== null
              ? `${stats.invitationsConverted} (${conversionPct}%)`
              : stats.invitationsConverted
          }
          icon={<TbUserCheck className="text-xl" />}
          accentClass="border-violet-200/80 bg-violet-50/50 dark:border-violet-900/50 dark:bg-violet-950/30"
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-gray-200/80 dark:border-gray-700/80 px-4 py-3 bg-gray-50/80 dark:bg-gray-800/40">
        <span className="mt-0.5 text-gray-500 dark:text-gray-400">
          <TbClock className="text-xl" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('users.stats.lastActivity')}</p>
          <p className="text-sm font-medium heading-text">
            {user.lastActivityAt
              ? formatDate(user.lastActivityAt, DATE_FORMATS.MEDIUM)
              : t('users.notProvided')}
          </p>
        </div>
        {user.invitationBalance !== undefined && (
          <div className="text-right shrink-0 pl-3 border-l border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
              {t('users.stats.invitationBalance')}
            </p>
            <p className="text-sm font-semibold tabular-nums heading-text">{user.invitationBalance}</p>
          </div>
        )}
      </div>
    </AdaptiveCard>
  )
}
