'use client'

import { useAuth } from '@/components/auth/AuthProvider'

const useAuthority = () => {
  const { user } = useAuth()

  const authority = user?.authority || []

  const hasAuthority = (authorities: string[]) => {
    return authorities.some(auth => authority.includes(auth))
  }

  const hasAllAuthority = (authorities: string[]) => {
    return authorities.every(auth => authority.includes(auth))
  }

  return {
    authority,
    hasAuthority,
    hasAllAuthority,
  }
}

export default useAuthority
