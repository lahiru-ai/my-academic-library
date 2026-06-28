import { getAccessToken } from './authService'

const DRIVE_API = 'https://www.googleapis.com/drive/v3'
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3'

async function authHeaders() {
  const token = getAccessToken()
  if (!token) throw new Error('Not authenticated')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function findOrCreateFolder(path: string[]): Promise<string> {
  let parentId: string | null = null

  for (const folderName of path) {
    const query: string = `name='${folderName.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder'${parentId ? ` and '${parentId}' in parents` : ''} and trashed=false`
    const headers = await authHeaders()
    const searchRes: Response = await fetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
      { headers },
    )
    const searchData: { files?: { id: string; name: string }[] } = await searchRes.json()

    if (searchData.files && searchData.files.length > 0) {
      parentId = searchData.files[0].id
    } else {
      const meta: { name: string; mimeType: string; parents: string[] } = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : [],
      }
      const createRes: Response = await fetch(`${DRIVE_API}/files`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(meta),
      })
      const created: { id: string } = await createRes.json()
      parentId = created.id
    }
  }

  return parentId!
}

export async function uploadFile(
  file: File,
  parentId: string,
  onProgress?: (percent: number) => void,
): Promise<{ id: string; name: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const token = getAccessToken()

    if (!token) {
      reject(new Error('Not authenticated'))
      return
    }

    xhr.open(
      'POST',
      `${UPLOAD_API}/files?uploadType=resumable&supportsAllDrives=true`,
    )
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('X-Upload-Content-Type', file.type)

    xhr.onload = function () {
      if (xhr.status === 200) {
        const location = xhr.getResponseHeader('Location')
        if (!location) {
          reject(new Error('No upload URL returned'))
          return
        }

        const uploadXhr = new XMLHttpRequest()
        uploadXhr.open('PUT', location)
        uploadXhr.setRequestHeader('Content-Type', file.type)

        uploadXhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100))
          }
        }

        uploadXhr.onload = () => {
          if (uploadXhr.status === 200 || uploadXhr.status === 201) {
            resolve(JSON.parse(uploadXhr.responseText))
          } else {
            reject(new Error('Upload failed'))
          }
        }

        uploadXhr.onerror = () => reject(new Error('Upload failed'))
        uploadXhr.send(file)
      } else {
        reject(new Error('Failed to initiate upload'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error'))

    const metadata = JSON.stringify({
      name: file.name,
      parents: [parentId],
    })
    xhr.send(metadata)
  })
}

export async function getFileInfo(fileId: string) {
  const headers = await authHeaders()
  const res = await fetch(
    `${DRIVE_API}/files/${fileId}?fields=id,name,mimeType,webViewLink,iconLink,size`,
    { headers },
  )
  if (!res.ok) throw new Error('Failed to get file info')
  return res.json()
}

export async function getDownloadUrl(fileId: string): Promise<string> {
  const token = getAccessToken()
  if (!token) throw new Error('Not authenticated')
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${token}`
}

export async function deleteFile(fileId: string): Promise<void> {
  const headers = await authHeaders()
  const res = await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error('Failed to delete file')
}

export async function getStorageQuota() {
  const headers = await authHeaders()
  const res = await fetch(`${DRIVE_API}/about?fields=storageQuota`, { headers })
  if (!res.ok) throw new Error('Failed to get storage quota')
  return res.json()
}
