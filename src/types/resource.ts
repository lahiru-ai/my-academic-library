export const RESOURCE_TYPES = [
  'Lecture Notes',
  'Tutorials',
  'My Answers',
  'Past Papers',
  'Senior Notes',
  'Books',
  'Videos',
  'Other',
] as const

export type ResourceType = (typeof RESOURCE_TYPES)[number]

export interface Resource {
  id: string
  title: string
  module: string
  resourceType: ResourceType
  topic: string
  tags: string
  description: string
  fileId: string
  uploadDate: string
  favorite: boolean
  needRevision: boolean
  lastOpened: string
}

export interface ResourceFilters {
  module: string
  resourceType: string
  tags: string
  favorite: boolean | null
  needRevision: boolean | null
  search: string
}

export type SortField = 'title' | 'uploadDate' | 'module' | 'resourceType'
export type SortDirection = 'asc' | 'desc'

export type ViewMode = 'grid' | 'list'
