'use client'

import useTranslation from '@/utils/hooks/useTranslation'
import type { Token, User } from '@/@types/auth'
import { useAuth } from '@/components/auth/AuthProvider'
import SignIn, { type OnSignInPayload } from '@/components/auth/SignIn'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { apiSignIn } from '@/services/users/AuthService'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'

const SignInClient = () => {
  const t = useTranslation('auth.signIn')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const callbackUrl = searchParams.get(REDIRECT_URL_KEY)
  const error = searchParams.get('error')

  const handleSignIn = async ({ values, setSubmitting, setMessage }: OnSignInPayload) => {
    setSubmitting(true)

    try {
      const response = await apiSignIn(values)

      if (response && response.token && response.user) {
        const token: Token = {
          accessToken: response.token.accessToken,
        }

        const user: User = {
          userId: response.user.userId,
          userName: response.user.userName,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          avatar: response.user.avatar,
          authority: response.user.authority,
          phone: response.user.phone,
          country: response.user.country,
          state: response.user.state,
          city: response.user.city,
          address: response.user.address,
          postalCode: response.user.postalCode,
          dateOfBirth: response.user.dateOfBirth,
          about: response.user.about,
        }

        if (!user.authority?.includes('admin')) {
          setMessage(t('adminOnly'))
          return
        }

        signIn(user, token)

        toast.push(
          <Notification title={t('loginSuccessful')} type="success">
            {t('welcomeBackUser', {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
            })}
          </Notification>
        )

        router.push(callbackUrl || appConfig.authenticatedEntryPath)
      }
    } catch (err: unknown) {
      console.error('Sign in error:', err)

      let errorMessage = 'Something went wrong!'
      if (err instanceof Error && err.message) {
        errorMessage = err.message
      }

      setMessage(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return <SignIn onSignIn={handleSignIn} initialError={error} />
}

export default SignInClient
