import { useState, useEffect, useCallback } from 'react'
import type { Resource, ResourceFilters, SortField, SortDirection } from '@/types'
import { getAllRows, appendRow, updateRow, deleteRow } from '@/services/sheetsService'
import { getCachedResources, setCachedResources } from '@/services/storageService'
import { generateId } from '@/utils/helpers'
import { useAuth } from './useAuth'

export function useResources() {
  const { isAuthenticated } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = useCallback(async () => {
    if (!isAuthenticated) return
    setIsLoading(true)
    setError(null)

    const cached = getCachedResources()
    if (cached) {
      setResources(cached)
      setIsLoading(false)
    }

    try {
      const data = await getAllRows()
      setResources(data)
      setCachedResources(data)
    } catch (err) {
      if (!cached) {
        setError(err instanceof Error ? err.message : 'Failed to load resources')
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const addResource = useCallback(
    async (resource: Omit<Resource, 'id' | 'uploadDate'>) => {
      const id = generateId()
      const now = new Date().toISOString()
      const newResource: Resource = { ...resource, id, uploadDate: now }

      await appendRow([
        id,
        newResource.title,
        newResource.module,
        newResource.resourceType,
        newResource.topic,
        newResource.tags,
        newResource.description,
        newResource.fileId,
        now,
        newResource.favorite ? 'TRUE' : 'FALSE',
        newResource.needRevision ? 'TRUE' : 'FALSE',
        '',
      ])

      setResources((prev) => [newResource, ...prev])
      setCachedResources([newResource, ...(getCachedResources() || [])])
      return newResource
    },
    [],
  )

  const updateResource = useCallback(
    async (id: string, data: Partial<Resource>) => {
      const existing = resources.find((r) => r.id === id)
      if (!existing) throw new Error('Resource not found')
      const updated = { ...existing, ...data }

      await updateRow(id, [
        updated.id,
        updated.title,
        updated.module,
        updated.resourceType,
        updated.topic,
        updated.tags,
        updated.description,
        updated.fileId,
        updated.uploadDate,
        updated.favorite ? 'TRUE' : 'FALSE',
        updated.needRevision ? 'TRUE' : 'FALSE',
        updated.lastOpened,
      ])

      setResources((prev) => prev.map((r) => (r.id === id ? updated : r)))
      const cached = getCachedResources()
      if (cached) {
        setCachedResources(cached.map((r) => (r.id === id ? updated : r)))
      }
      return updated
    },
    [resources],
  )

  const deleteResource = useCallback(
    async (id: string) => {
      await deleteRow(id)
      setResources((prev) => prev.filter((r) => r.id !== id))
      const cached = getCachedResources()
      if (cached) {
        setCachedResources(cached.filter((r) => r.id !== id))
      }
    },
    [],
  )

  const getResourceById = useCallback(
    (id: string) => resources.find((r) => r.id === id),
    [resources],
  )

  const getFilteredResources = useCallback(
    (filters: ResourceFilters, sortField: SortField, sortDirection: SortDirection) => {
      let filtered = [...resources]

      if (filters.search) {
        const q = filters.search.toLowerCase()
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.topic.toLowerCase().includes(q) ||
            r.tags.toLowerCase().includes(q) ||
            r.module.toLowerCase().includes(q) ||
            r.resourceType.toLowerCase().includes(q),
        )
      }

      if (filters.module) {
        filtered = filtered.filter((r) => r.module === filters.module)
      }
      if (filters.resourceType) {
        filtered = filtered.filter((r) => r.resourceType === filters.resourceType)
      }
      if (filters.favorite === true) {
        filtered = filtered.filter((r) => r.favorite)
      }
      if (filters.needRevision === true) {
        filtered = filtered.filter((r) => r.needRevision)
      }

      filtered.sort((a, b) => {
        let cmp = 0
        switch (sortField) {
          case 'title':
            cmp = a.title.localeCompare(b.title)
            break
          case 'uploadDate':
            cmp = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
            break
          case 'module':
            cmp = a.module.localeCompare(b.module)
            break
          case 'resourceType':
            cmp = a.resourceType.localeCompare(b.resourceType)
            break
        }
        return sortDirection === 'desc' ? -cmp : cmp
      })

      return filtered
    },
    [resources],
  )

  return {
    resources,
    isLoading,
    error,
    fetchResources,
    addResource,
    updateResource,
    deleteResource,
    getResourceById,
    getFilteredResources,
  }
}
