'use client'

import { useCallback, useEffect, useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import { Avatar, Tag, toast } from '@/components/ui'
import useTranslation from '@/utils/hooks/useTranslation'
import { AdminUsersService } from '@/services/admin'
import type { AdminUserAccountStatus, AdminUserDetail } from '@/@types/adminUsers'
import { DATE_FORMATS, formatDate } from '@/utils/dateDisplay'
import { useRouter } from '@/i18n/navigation'
import { UserNetworkSection, UserProfileSection } from './UserDetailSections'

type UserDetailsPageProps = {
  userId: string
}

type ModerationAction = 'suspend' | 'ban' | null

const statusTagClass: Record<AdminUserAccountStatus, string> = {
  active:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-0',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-0',
  suspended: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-0',
  banned: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-0',
}

const UserDetailsPage = ({ userId }: UserDetailsPageProps) => {
  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [moderationAction, setModerationAction] = useState<ModerationAction>(null)
  const [moderationReason, setModerationReason] = useState('')
  const [isModerating, setIsModerating] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const tAdmin = useTranslation('admin')
  const tCommon = useTranslation('common')
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setNotFound(false)
      const data = await AdminUsersService.getUserDetail(userId)
      setUser(data)
    } catch (err) {
      console.error('Failed to fetch user detail:', err)
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        setNotFound(true)
      } else {
        setError(tAdmin('users.detailLoadError'))
      }
    } finally {
      setLoading(false)
    }
  }, [tAdmin, userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleModerationSubmit = async () => {
    if (!user || !moderationAction || !moderationReason.trim()) return

    try {
      setIsModerating(true)
      const updated =
        moderationAction === 'suspend'
          ? await AdminUsersService.suspendUser(user.id, moderationReason.trim())
          : await AdminUsersService.banUser(user.id, moderationReason.trim())

      setUser(prev =>
        prev
          ? {
              ...prev,
              status: updated.status,
              moderationReason: moderationReason.trim(),
              isBlocked: true,
            }
          : prev
      )
      setModerationAction(null)
      setModerationReason('')
      toast.push(
        <Notification type="success">{tAdmin('users.moderationSuccess')}</Notification>,
        { placement: 'top-center' }
      )
    } catch (err) {
      console.error('Moderation failed:', err)
      toast.push(
        <Notification type="danger">
          {tAdmin('users.moderationError') || tCommon('error')}
        </Notification>,
        { placement: 'top-center' }
      )
    } finally {
      setIsModerating(false)
    }
  }

  const handleActivate = async () => {
    if (!user) return
    try {
      setIsActivating(true)
      const updated = await AdminUsersService.activateUser(user.id)
      setUser(prev =>
        prev
          ? {
              ...prev,
              status: updated.status,
              moderationReason: null,
              isBlocked: false,
            }
          : prev
      )
      toast.push(
        <Notification type="success">{tAdmin('users.activateSuccess')}</Notification>,
        { placement: 'top-center' }
      )
    } catch (err) {
      console.error('Activate failed:', err)
      toast.push(
        <Notification type="danger">
          {tAdmin('users.activateError') || tCommon('error')}
        </Notification>,
        { placement: 'top-center' }
      )
    } finally {
      setIsActivating(false)
    }
  }

  const handleExport = async () => {
    if (!user) return
    try {
      setIsExporting(true)
      await AdminUsersService.exportUserData(user.id)
      toast.push(
        <Notification type="success">{tAdmin('users.gdpr.exportSuccess')}</Notification>,
        { placement: 'top-center' }
      )
    } catch (err) {
      console.error('Export failed:', err)
      toast.push(
        <Notification type="danger">
          {tAdmin('users.gdpr.exportError') || tCommon('error')}
        </Notification>,
        { placement: 'top-center' }
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return
    try {
      setIsDeleting(true)
      await AdminUsersService.deleteUser(user.id)
      toast.push(
        <Notification type="success">{tAdmin('users.gdpr.deleteSuccess')}</Notification>,
        { placement: 'top-center' }
      )
      router.push('/admin/users/list')
    } catch (err) {
      console.error('Delete failed:', err)
      toast.push(
        <Notification type="danger">
          {tAdmin('users.gdpr.deleteError') || tCommon('error')}
        </Notification>,
        { placement: 'top-center' }
      )
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
    }
  }

  const handleBackToList = () => {
    router.push('/admin/users/list')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <Container className="py-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-2 heading-text">
            {tAdmin('users.notFoundTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{tAdmin('users.notFoundMessage')}</p>
          <Button variant="solid" onClick={handleBackToList}>
            {tAdmin('users.backToList')}
          </Button>
        </div>
      </Container>
    )
  }

  if (error || !user) {
    return (
      <Container className="py-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-2 heading-text">
            {tAdmin('users.detailErrorTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || tAdmin('users.detailLoadError')}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="default" onClick={fetchUser}>
              {tCommon('tryAgain')}
            </Button>
            <Button variant="outline" onClick={handleBackToList}>
              {tAdmin('users.backToList')}
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  const displayName = user.name || tAdmin('users.notProvided')
  const canModerate = user.status === 'active' || user.status === 'inactive'
  const canActivate = user.status === 'suspended' || user.status === 'banned'

  return (
    <Container className="py-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold heading-text">{tAdmin('users.detailTitle')}</h1>
        <Button size="sm" variant="outline" onClick={handleBackToList}>
          {tAdmin('users.backToList')}
        </Button>
      </div>

      <AdaptiveCard className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar size={72} src={user.avatar || undefined} alt={displayName}>
              {!user.avatar && displayName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold heading-text mb-1">{displayName}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <Tag className={statusTagClass[user.status]}>{tAdmin(`users.status.${user.status}`)}</Tag>
                {user.maskedCode && (
                  <Tag className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-0 font-mono">
                    {user.maskedCode}
                  </Tag>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {tAdmin('users.summary.registeredAt')}:{' '}
                {formatDate(user.signupDate, DATE_FORMATS.SHORT)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canModerate && (
              <>
                <Button size="sm" variant="default" onClick={() => setModerationAction('suspend')}>
                  {tAdmin('users.actions.suspend')}
                </Button>
                <Button size="sm" variant="solid" onClick={() => setModerationAction('ban')}>
                  {tAdmin('users.actions.ban')}
                </Button>
              </>
            )}
            {canActivate && (
              <Button size="sm" variant="outline" loading={isActivating} onClick={handleActivate}>
                {tAdmin('users.actions.activate')}
              </Button>
            )}
          </div>
        </div>
        {user.moderationReason && (
          <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">
            <span className="font-medium">{tAdmin('users.moderationReason')}:</span> {user.moderationReason}
          </p>
        )}
      </AdaptiveCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
        <UserProfileSection user={user} />
        <UserNetworkSection user={user} />
      </div>

      <AdaptiveCard className="mb-6">
        <h3 className="text-base font-semibold mb-4 heading-text">
          {tAdmin('users.sections.devices')}
        </h3>
        {user.devices.length === 0 ? (
          <p className="text-sm text-gray-500">{tAdmin('users.devices.empty')}</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {user.devices.map(device => (
              <li
                key={device.id}
                className="flex justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
              >
                <span>{device.platform || tAdmin('users.devices.unknownPlatform')}</span>
                <span className="text-gray-500">
                  {formatDate(device.updatedAt, DATE_FORMATS.MEDIUM)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AdaptiveCard>

      <AdaptiveCard>
        <h3 className="text-base font-semibold mb-4 heading-text">
          {tAdmin('users.sections.gdpr')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {tAdmin('users.gdpr.description')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" loading={isExporting} onClick={handleExport}>
            {tAdmin('users.gdpr.export')}
          </Button>
          <Button size="sm" variant="solid" onClick={() => setDeleteConfirmOpen(true)}>
            {tAdmin('users.gdpr.delete')}
          </Button>
        </div>
      </AdaptiveCard>

      <Dialog
        isOpen={moderationAction !== null}
        onClose={() => {
          setModerationAction(null)
          setModerationReason('')
        }}
      >
        <h4 className="text-lg font-semibold mb-2 heading-text">
          {moderationAction === 'suspend'
            ? tAdmin('users.actions.suspend')
            : tAdmin('users.actions.ban')}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {tAdmin('users.moderationReasonHint')}
        </p>
        <Input
          textArea
          rows={3}
          value={moderationReason}
          placeholder={tAdmin('users.moderationReasonPlaceholder')}
          onChange={e => setModerationReason(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            size="sm"
            variant="plain"
            onClick={() => {
              setModerationAction(null)
              setModerationReason('')
            }}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            size="sm"
            variant="solid"
            loading={isModerating}
            disabled={!moderationReason.trim()}
            onClick={handleModerationSubmit}
          >
            {tCommon('confirm')}
          </Button>
        </div>
      </Dialog>

      <Dialog isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <h4 className="text-lg font-semibold mb-2 heading-text">
          {tAdmin('users.gdpr.deleteConfirmTitle')}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {tAdmin('users.gdpr.deleteConfirmMessage')}
        </p>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="plain" onClick={() => setDeleteConfirmOpen(false)}>
            {tCommon('cancel')}
          </Button>
          <Button size="sm" variant="solid" loading={isDeleting} onClick={handleDelete}>
            {tAdmin('users.gdpr.delete')}
          </Button>
        </div>
      </Dialog>
    </Container>
  )
}

export default UserDetailsPage
