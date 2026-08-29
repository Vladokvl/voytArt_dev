'use client'

import { Token, User } from '@/@types/auth'
import { getCurrentUser } from '@/services/users/UserService'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  token: Token | null
  isLoading: boolean
  signIn: (user: User, token: Token) => void
  signOut: () => void
  updateUser: (user: User) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<Token | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('auth_user')
      const savedToken = localStorage.getItem('auth_token')

      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setToken({ accessToken: savedToken })

          document.cookie = `auth_token=${savedToken}; path=/; max-age=86400; secure; samesite=strict`

          try {
            const freshUser = await getCurrentUser()
            setUser(freshUser)
            localStorage.setItem('auth_user', JSON.stringify(freshUser))
          } catch (error) {
            console.error('Error loading fresh user data:', error)
          }
        } catch (error) {
          console.error('Error parsing saved auth data:', error)
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_token')
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const signIn = (userData: User, tokenData: Token) => {
    setUser(userData)
    setToken(tokenData)

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('auth_token', tokenData.accessToken)
      document.cookie = `auth_token=${tokenData.accessToken}; path=/; max-age=86400; secure; samesite=strict`
    }
  }

  const signOut = () => {
    setUser(null)
    setToken(null)

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
  }

  const refreshUser = async () => {
    try {
      const freshUser = await getCurrentUser()
      updateUser(freshUser)
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    signIn,
    signOut,
    updateUser,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
