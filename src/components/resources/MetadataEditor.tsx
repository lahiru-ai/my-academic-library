import { useState } from 'react'
import type { Resource, ResourceType } from '@/types'
import { RESOURCE_TYPES } from '@/types'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Toggle } from '@/components/common/Toggle'
import { Button } from '@/components/common/Button'
import { useModules } from '@/hooks/useModules'

interface MetadataEditorProps {
  resource: Resource
  onSave: (data: Partial<Resource>) => Promise<void>
  onCancel: () => void
}

export function MetadataEditor({ resource, onSave, onCancel }: MetadataEditorProps) {
  const { activeModules } = useModules()
  const [title, setTitle] = useState(resource.title)
  const [module, setModule] = useState(resource.module)
  const [resourceType, setResourceType] = useState(resource.resourceType)
  const [topic, setTopic] = useState(resource.topic)
  const [tags, setTags] = useState(resource.tags)
  const [description, setDescription] = useState(resource.description)
  const [favorite, setFavorite] = useState(resource.favorite)
  const [needRevision, setNeedRevision] = useState(resource.needRevision)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({
        title,
        module,
        resourceType: resourceType as (typeof RESOURCE_TYPES)[number],
        topic,
        tags,
        description,
        favorite,
        needRevision,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        id="edit-title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          id="edit-module"
          label="Module"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          options={activeModules.map((m) => ({ value: m.name, label: m.name }))}
        />
        <Select
          id="edit-type"
          label="Resource Type"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value as Resource['resourceType'])}
          options={RESOURCE_TYPES.map((t) => ({ value: t, label: t }))}
        />
      </div>
      <Input
        id="edit-topic"
        label="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <Input
        id="edit-tags"
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <Toggle
          id="edit-fav"
          label="Favorite"
          checked={favorite}
          onChange={(e) => setFavorite(e.target.checked)}
        />
        <Toggle
          id="edit-rev"
          label="Need Revision"
          checked={needRevision}
          onChange={(e) => setNeedRevision(e.target.checked)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
