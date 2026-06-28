import { STORAGE_KEYS, CACHE_TTL } from '@/utils/constants'
import type { Resource } from '@/types'

export function getCachedResources(): Resource[] | null {
  const data = localStorage.getItem(STORAGE_KEYS.RESOURCE_CACHE)
  const timestamp = localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP)
  if (!data || !timestamp) return null
  if (Date.now() - Number(timestamp) > CACHE_TTL) {
    localStorage.removeItem(STORAGE_KEYS.RESOURCE_CACHE)
    localStorage.removeItem(STORAGE_KEYS.CACHE_TIMESTAMP)
    return null
  }
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function setCachedResources(resources: Resource[]): void {
  localStorage.setItem(STORAGE_KEYS.RESOURCE_CACHE, JSON.stringify(resources))
  localStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMP, String(Date.now()))
}

export function clearCache(): void {
  localStorage.removeItem(STORAGE_KEYS.RESOURCE_CACHE)
  localStorage.removeItem(STORAGE_KEYS.CACHE_TIMESTAMP)
}

export function getSetting<T>(key: string, fallback: T): T {
  const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  if (!settings) return fallback
  try {
    const parsed = JSON.parse(settings)
    return parsed[key] ?? fallback
  } catch {
    return fallback
  }
}

export function setSetting(key: string, value: unknown): void {
  const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  const parsed = settings ? JSON.parse(settings) : {}
  parsed[key] = value
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed))
}

export function getRecentActivity(): { type: 'open' | 'upload'; resourceId: string; timestamp: string }[] {
  const data = localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY)
  return data ? JSON.parse(data) : []
}

export function addRecentActivity(
  activity: { type: 'open' | 'upload'; resourceId: string },
): void {
  const activities = getRecentActivity()
  activities.unshift({ ...activity, timestamp: new Date().toISOString() })
  if (activities.length > 100) activities.pop()
  localStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITY, JSON.stringify(activities))
}

export function clearAllLocalData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}
