'use client'

import { useEffect } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm, { type OnSignIn } from './SignInForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'

type SignInProps = {
  onSignIn?: OnSignIn
  initialError?: string | null
}

const SignIn = ({ onSignIn, initialError }: SignInProps) => {
  const t = useTranslation('auth.signIn')
  const [message, setMessage] = useTimeOutMessage()

  const mode = useTheme(state => state.mode)

  useEffect(() => {
    if (initialError) {
      setMessage(initialError)
    }
  }, [initialError, setMessage])

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo type="full" mode={mode} className="mb-5" />
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{t('enterCredentials')}</p>
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <span className="break-all">{message}</span>
        </Alert>
      )}
      <SignInForm setMessage={setMessage} onSignIn={onSignIn} />
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">{t('adminOnly')}</p>
    </>
  )
}

export default SignIn
