import Papa from 'papaparse'
import type { Resource } from '@/types'

export function exportToCsv(resources: Resource[]): void {
  const data = resources.map((r) => ({
    ID: r.id,
    Title: r.title,
    Module: r.module,
    'Resource Type': r.resourceType,
    Topic: r.topic,
    Tags: r.tags,
    Description: r.description,
    'File ID': r.fileId,
    'Upload Date': r.uploadDate,
    Favorite: r.favorite ? 'TRUE' : 'FALSE',
    'Need Revision': r.needRevision ? 'TRUE' : 'FALSE',
    'Last Opened': r.lastOpened,
  }))

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `my-academic-library-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importFromCsv(
  csvContent: string,
): Omit<Resource, 'fileId' | 'uploadDate'>[] {
  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  return result.data.map((row) => ({
    id: row['ID'] || crypto.randomUUID(),
    title: row['Title'] || '',
    module: row['Module'] || '',
    resourceType: (row['Resource Type'] as Resource['resourceType']) || 'Other',
    topic: row['Topic'] || '',
    tags: row['Tags'] || '',
    description: row['Description'] || '',
    favorite: row['Favorite']?.toUpperCase() === 'TRUE',
    needRevision: row['Need Revision']?.toUpperCase() === 'TRUE',
    lastOpened: row['Last Opened'] || '',
  }))
}
