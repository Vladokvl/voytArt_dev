import { useAuth } from '@/components/auth/AuthProvider'

const useCurrentSession = () => {
  const { user, token, isLoading } = useAuth()

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
  }
}

export default useCurrentSession
