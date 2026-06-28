import { getAccessToken } from './authService'
import { SHEET_NAME, SHEET_HEADERS } from '@/utils/constants'
import type { Resource, ResourceType } from '@/types'

function getSheetId(): string {
  return import.meta.env.VITE_GOOGLE_SHEET_ID
}

function sheetApiUrl(action: string): string {
  const id = getSheetId()
  if (!id) throw new Error('Google Sheet ID not configured')
  return `https://sheets.googleapis.com/v4/spreadsheets/${id}/${action}`
}

async function authHeaders() {
  const token = getAccessToken()
  if (!token) throw new Error('Not authenticated')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function ensureSheetExists(): Promise<void> {
  const id = getSheetId()
  if (!id) {
    throw new Error(
      'VITE_GOOGLE_SHEET_ID is not configured. Create a Google Sheet and add its ID to your .env file.',
    )
  }

  try {
    const headers = await authHeaders()
    const res = await fetch(sheetApiUrl(''), { headers })
    if (!res.ok) throw new Error('Sheet not accessible')
    const data = await res.json()

    const sheetExists = data.sheets?.some(
      (s: { properties: { title: string } }) => s.properties.title === SHEET_NAME,
    )

    if (!sheetExists) {
      await fetch(sheetApiUrl(':batchUpdate'), {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: { title: SHEET_NAME },
              },
            },
          ],
        }),
      })
      await appendRow(SHEET_HEADERS)
    }
  } catch (err) {
    console.error('Failed to ensure sheet exists:', err)
    throw err
  }
}

export async function appendRow(values: string[]): Promise<void> {
  const headers = await authHeaders()
  const res = await fetch(
    `${sheetApiUrl(`values/${SHEET_NAME}!A:L:append`)}?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        values: [values],
      }),
    },
  )
  if (!res.ok) throw new Error('Failed to append row')
}

export async function getAllRows(): Promise<Resource[]> {
  const headers = await authHeaders()
  const res = await fetch(
    `${sheetApiUrl(`values/${SHEET_NAME}!A:L`)}?valueRenderOption=FORMATTED_VALUE`,
    { headers },
  )
  if (!res.ok) throw new Error('Failed to fetch rows')

  const data = await res.json()
  const rows: string[][] = data.values || []

  if (rows.length <= 1) return []

  return rows.slice(1).map((row) => ({
    id: row[0] || '',
    title: row[1] || '',
    module: row[2] || '',
    resourceType: (row[3] || 'Other') as Resource['resourceType'],
    topic: row[4] || '',
    tags: row[5] || '',
    description: row[6] || '',
    fileId: row[7] || '',
    uploadDate: row[8] || '',
    favorite: row[9]?.toUpperCase() === 'TRUE',
    needRevision: row[10]?.toUpperCase() === 'TRUE',
    lastOpened: row[11] || '',
  }))
}

export async function updateRow(resourceId: string, values: string[]): Promise<void> {
  const all = await getAllRows()
  const idx = all.findIndex((r) => r.id === resourceId)
  if (idx === -1) throw new Error('Resource not found')

  const rowNum = idx + 2
  const headers = await authHeaders()
  const res = await fetch(
    `${sheetApiUrl(`values/${SHEET_NAME}!A${rowNum}:L${rowNum}`)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        values: [values],
      }),
    },
  )
  if (!res.ok) throw new Error('Failed to update row')
}

export async function deleteRow(resourceId: string): Promise<void> {
  const all = await getAllRows()
  const idx = all.findIndex((r) => r.id === resourceId)
  if (idx === -1) throw new Error('Resource not found')

  const rowNum = idx + 2
  const headers = await authHeaders()
  const res = await fetch(
    `${sheetApiUrl(`values/${SHEET_NAME}!A${rowNum}:L${rowNum}:clear`)}`,
    { method: 'POST', headers },
  )
  if (!res.ok) throw new Error('Failed to delete row')
}

export async function findRowByFileId(fileId: string): Promise<Resource | null> {
  const all = await getAllRows()
  return all.find((r) => r.fileId === fileId) || null
}
