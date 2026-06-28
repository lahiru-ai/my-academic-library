import { Button } from '@/components/common/Button'
import { AlertTriangle } from 'lucide-react'

interface DeleteDialogProps {
  title: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function DeleteDialog({ title, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-text-primary font-medium">
            Are you sure you want to delete "{title}"?
          </p>
          <p className="text-xs text-text-secondary mt-1">
            This will permanently delete the file from Google Drive and its metadata from
            Google Sheets. This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  )
}
