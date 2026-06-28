import { useState, useCallback } from 'react'
import { findOrCreateFolder, uploadFile, deleteFile } from '@/services/driveService'
import { DRIVE_FOLDER_NAME } from '@/utils/constants'
import { toast } from 'sonner'

interface UploadProgress {
  fileName: string
  percent: number
  status: 'uploading' | 'done' | 'error'
}

export function useDrive() {
  const [progress, setProgress] = useState<UploadProgress[]>([])

  const uploadFiles = useCallback(
    async (
      files: File[],
      level: string,
      moduleName: string,
      resourceType: string,
    ): Promise<string[]> => {
      const initial = files.map((f) => ({
        fileName: f.name,
        percent: 0,
        status: 'uploading' as const,
      }))
      setProgress(initial)

      const path = [DRIVE_FOLDER_NAME]
      if (level) path.push(level)
      path.push(moduleName, resourceType)
      const folderId = await findOrCreateFolder(path)

      const fileIds: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          const result = await uploadFile(file, folderId, (percent) => {
            setProgress((prev) =>
              prev.map((p, idx) =>
                idx === i ? { ...p, percent } : p,
              ),
            )
          })
          fileIds.push(result.id)
          setProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, percent: 100, status: 'done' as const } : p,
            ),
          )
        } catch {
          setProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: 'error' as const } : p,
            ),
          )
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      return fileIds
    },
    [],
  )

  const removeFile = useCallback(async (fileId: string) => {
    await deleteFile(fileId)
  }, [])

  const resetProgress = useCallback(() => {
    setProgress([])
  }, [])

  return { progress, uploadFiles, removeFile, resetProgress }
}
