import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getUserProfile,
  setUserProfile,
  removeUserProfile,
  isTokenExpired,
} from '@/services/authService'
import type { GoogleUserProfile } from '@/types'

interface AuthContextType {
  user: GoogleUserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    const profile = getUserProfile()
    if (token && profile && !isTokenExpired(token)) {
      setUser(profile)
    } else {
      removeAccessToken()
      removeUserProfile()
    }
    setIsLoading(false)
  }, [])

  const login = useGoogleLogin({
    scope: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
      'email',
      'profile',
    ].join(' '),
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token)
      try {
        const res = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
        )
        const profile = await res.json()
        const userProfile: GoogleUserProfile = {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          sub: profile.sub,
        }
        setUserProfile(userProfile)
        setUser(userProfile)
      } catch {
        console.error('Failed to fetch user profile')
      }
    },
    onError: () => {
      console.error('Login failed')
    },
  })

  const logout = useCallback(() => {
    googleLogout()
    removeAccessToken()
    removeUserProfile()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
