import { useState, useCallback } from 'react'
import { getRecentActivity, addRecentActivity } from '@/services/storageService'
import type { Resource } from '@/types'

interface ActivityItem {
  type: 'open' | 'upload'
  resource: Resource
  timestamp: string
}

export function useRecentActivity(resources: Resource[]) {
  const [activities] = useState<{ type: 'open' | 'upload'; resourceId: string; timestamp: string }[]>(
    getRecentActivity,
  )

  const trackOpen = useCallback(
    (resourceId: string) => {
      addRecentActivity({ type: 'open', resourceId })
    },
    [],
  )

  const trackUpload = useCallback(
    (resourceId: string) => {
      addRecentActivity({ type: 'upload', resourceId })
    },
    [],
  )

  const getRecentOpened = useCallback((): ActivityItem[] => {
    return activities
      .filter((a) => a.type === 'open')
      .slice(0, 10)
      .map((a) => ({
        type: a.type as 'open',
        resource: resources.find((r) => r.id === a.resourceId)!,
        timestamp: a.timestamp,
      }))
      .filter((a) => a.resource)
  }, [activities, resources])

  const getRecentUploaded = useCallback((): ActivityItem[] => {
    return activities
      .filter((a) => a.type === 'upload')
      .slice(0, 10)
      .map((a) => ({
        type: a.type as 'upload',
        resource: resources.find((r) => r.id === a.resourceId)!,
        timestamp: a.timestamp,
      }))
      .filter((a) => a.resource)
  }, [activities, resources])

  return { trackOpen, trackUpload, getRecentOpened, getRecentUploaded }
}
