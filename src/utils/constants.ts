import { RESOURCE_TYPES } from '@/types'

export { RESOURCE_TYPES }

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
]

export const DRIVE_FOLDER_NAME = 'University'

export const SHEET_NAME = 'Resources'

export const SHEET_HEADERS = [
  'ID',
  'Title',
  'Module',
  'Resource Type',
  'Topic',
  'Tags',
  'Description',
  'File ID',
  'Upload Date',
  'Favorite',
  'Need Revision',
  'Last Opened',
]

export const MODULE_ICONS = [
  'BookOpen',
  'Code',
  'Image',
  'Sigma',
  'BarChart3',
  'FlaskConical',
  'Globe',
  'Music',
  'Languages',
  'Brain',
  'Calculator',
  'PenTool',
] as const

export const MODULE_COLORS = [
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
  '#14b8a6',
  '#a855f7',
] as const

export const ITEMS_PER_PAGE = 20

export const CACHE_TTL = 5 * 60 * 1000

export const STORAGE_KEYS = {
  THEME: 'ml-theme',
  MODULES: 'ml-modules',
  RECENT_ACTIVITY: 'ml-recent-activity',
  AUTH_TOKEN: 'ml-auth-token',
  USER_PROFILE: 'ml-user-profile',
  SETTINGS: 'ml-settings',
  RESOURCE_CACHE: 'ml-resource-cache',
  CACHE_TIMESTAMP: 'ml-cache-ts',
} as const
