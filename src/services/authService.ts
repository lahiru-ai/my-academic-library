import { STORAGE_KEYS } from '@/utils/constants'

export function getAccessToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
}

export function setAccessToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

export function removeAccessToken(): void {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
}

export function getUserProfile(): { email: string; name: string; picture: string; sub: string } | null {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
  return stored ? JSON.parse(stored) : null
}

export function setUserProfile(profile: { email: string; name: string; picture: string; sub: string }): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
}

export function removeUserProfile(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE)
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
