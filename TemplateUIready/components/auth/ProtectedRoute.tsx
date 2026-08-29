'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import appConfig from '@/configs/app.config'
import { useRouteAuthority } from '@/utils/hooks/useRouteAuthority'
import { useRouter } from '@/i18n/navigation'
import { useEffect, type ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredAuthority?: string[]
}

const ProtectedRoute = ({ children, requiredAuthority = [] }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const routeAuthority = useRouteAuthority()

  // Combine authority from props and route configuration
  const finalAuthority = requiredAuthority.length > 0 ? requiredAuthority : routeAuthority

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated
      if (!user) {
        router.push(appConfig.unAuthenticatedEntryPath)
        return
      }

      // If authority check is required
      if (finalAuthority.length > 0) {
        const hasAuthority = finalAuthority.some(auth => user.authority?.includes(auth))

        if (!hasAuthority) {
          router.push('/access-denied')
          return
        }
      }
    }
  }, [user, isLoading, finalAuthority, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, don't show content
  if (!user) {
    return null
  }

  // If authority check is required and user doesn't have required authority
  if (finalAuthority.length > 0) {
    const hasAuthority = finalAuthority.some(auth => user.authority?.includes(auth))

    if (!hasAuthority) {
      return null
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
