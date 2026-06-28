import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatDateRelative(dateStr: string): string {
  if (!dateStr) return ''
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '...'
}

export function parseTags(tags: string): string[] {
  if (!tags) return []
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function getMimeTypeIcon(mimeType: string): string {
  if (mimeType.includes('pdf')) return 'FileText'
  if (mimeType.includes('image')) return 'FileImage'
  if (mimeType.includes('video')) return 'FileVideo'
  if (mimeType.includes('audio')) return 'FileAudio'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar'))
    return 'FileArchive'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'FileText'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'FileSpreadsheet'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
    return 'FileSlides'
  return 'File'
}
