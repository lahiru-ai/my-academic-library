import { useState } from 'react'
import { DropZone } from './DropZone'
import { UploadProgress } from './UploadProgress'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { Toggle } from '@/components/common/Toggle'
import { RESOURCE_TYPES } from '@/utils/constants'
import { useModules } from '@/hooks/useModules'
import { useDrive } from '@/hooks/useDrive'
import { useResources } from '@/hooks/useResources'
import { useRecentActivity } from '@/hooks/useRecentActivity'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'

export function UploadForm() {
  const { activeModules } = useModules()
  const { uploadFiles, progress, resetProgress } = useDrive()
  const { addResource, resources } = useResources()
  const { trackUpload } = useRecentActivity(resources)
  const { isAuthenticated } = useAuth()

  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState('')
  const [module, setModule] = useState('')
  const [resourceType, setResourceType] = useState('')
  const [level, setLevel] = useState('')
  const [topic, setTopic] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [favorite, setFavorite] = useState(false)
  const [needRevision, setNeedRevision] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const canSubmit =
    files.length > 0 && title.trim() && module && resourceType && isAuthenticated

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsUploading(true)

    try {
      const fileIds = await uploadFiles(files, level, module, resourceType)

      for (let i = 0; i < fileIds.length; i++) {
        const resource = await addResource({
          title: i === 0 ? title : `${title} (${files[i].name})`,
          module,
          resourceType: resourceType as (typeof RESOURCE_TYPES)[number],
          topic,
          tags,
          description,
          fileId: fileIds[i],
          favorite,
          needRevision,
          lastOpened: '',
        })
        trackUpload(resource.id)
      }

      toast.success(`Uploaded ${files.length} file(s) successfully`)
      setFiles([])
      setTitle('')
      setModule('')
      setResourceType('')
      setLevel('')
      setTopic('')
      setTags('')
      setDescription('')
      setFavorite(false)
      setNeedRevision(false)
      resetProgress()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <DropZone
        files={files}
        onFilesSelected={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
        onFileRemove={(idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))}
      />

      <UploadProgress items={progress} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="title"
          label="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Chapter 1 - Introduction"
        />
        <Select
          id="module"
          label="Module *"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          placeholder="Select module..."
          options={activeModules.map((m) => ({ value: m.name, label: m.name }))}
        />
        <Select
          id="type"
          label="Resource Type *"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          placeholder="Select type..."
          options={RESOURCE_TYPES.map((t) => ({ value: t, label: t }))}
        />
        <Input
          id="level"
          label="Level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="e.g., Year 2, Semester 3"
        />
        <Input
          id="topic"
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Linear Algebra"
        />
        <Input
          id="tags"
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., exam, final, review"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
          placeholder="Optional description..."
        />
      </div>

      <div className="flex items-center gap-6">
        <Toggle
          id="upload-fav"
          label="Mark as favorite"
          checked={favorite}
          onChange={(e) => setFavorite(e.target.checked)}
        />
        <Toggle
          id="upload-rev"
          label="Mark for revision"
          checked={needRevision}
          onChange={(e) => setNeedRevision(e.target.checked)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          isLoading={isUploading}
        >
          <FileText className="h-4 w-4" />
          Upload to Drive
        </Button>
      </div>
    </div>
  )
}
