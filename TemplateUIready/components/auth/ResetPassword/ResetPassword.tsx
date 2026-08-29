'use client'

import { useState } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ResetPasswordForm, { type OnResetPasswordSubmit } from './ResetPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useRouter } from '@/i18n/navigation'

type ResetPasswordProps = {
  signInUrl?: string
  onResetPasswordSubmit?: OnResetPasswordSubmit
}

export const ResetPassword = ({
  signInUrl = '/sign-in',
  onResetPasswordSubmit,
}: ResetPasswordProps) => {
  const t = useTranslation('auth.resetPassword')
  const tSignIn = useTranslation('auth.signIn')
  const [resetComplete, setResetComplete] = useState(false)

  const [message, setMessage] = useTimeOutMessage()

  const router = useRouter()

  const handleContinue = () => {
    router.push(signInUrl)
  }

  return (
    <div>
      <div className="mb-6">
        {resetComplete ? (
          <>
            <h3 className="mb-1">{t('resetDone')}</h3>
            <p className="font-semibold heading-text">{t('passwordResetSuccess')}</p>
          </>
        ) : (
          <>
            <h3 className="mb-1">{t('setNewPassword')}</h3>
            <p className="font-semibold heading-text">{t('passwordMustBeDifferent')}</p>
          </>
        )}
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <span className="break-all">{message}</span>
        </Alert>
      )}
      <ResetPasswordForm
        resetComplete={resetComplete}
        setMessage={setMessage}
        setResetComplete={setResetComplete}
        onResetPasswordSubmit={onResetPasswordSubmit}
      >
        <Button block variant="solid" type="button" onClick={handleContinue}>
          {t('continue')}
        </Button>
      </ResetPasswordForm>
      <div className="mt-4 text-center">
        <span>{t('backTo')} </span>
        <ActionLink href={signInUrl} className="heading-text font-bold" themeColor={false}>
          {tSignIn('title')}
        </ActionLink>
      </div>
    </div>
  )
}

export default ResetPassword
