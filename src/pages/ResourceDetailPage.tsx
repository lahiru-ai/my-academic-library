import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useResources } from '@/hooks/useResources'
import { useRecentActivity } from '@/hooks/useRecentActivity'
import { PageHeader } from '@/components/layout/PageHeader'
import { FilePreview } from '@/components/resources/FilePreview'
import { MetadataEditor } from '@/components/resources/MetadataEditor'
import { DeleteDialog } from '@/components/resources/DeleteDialog'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Modal } from '@/components/common/Modal'
import { Skeleton } from '@/components/common/Skeleton'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useModules } from '@/hooks/useModules'
import type { Resource } from '@/types'
import {
  ArrowLeft,
  Heart,
  BookMarked,
  Edit3,
  Trash2,
  Calendar,
  FolderOpen,
  Tag,
  FileText,
} from 'lucide-react'
import { formatDate, parseTags } from '@/utils/helpers'
import { toast } from 'sonner'
import { useDrive } from '@/hooks/useDrive'

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getResourceById, updateResource, deleteResource, resources } = useResources()
  const { trackOpen } = useRecentActivity(resources)
  const { getModule } = useModules()
  const { removeFile } = useDrive()

  const [resource, setResource] = useState(() => (id ? getResourceById(id) : undefined))
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (id) {
      const r = getResourceById(id)
      setResource(r)
      if (r) {
        trackOpen(id)
        updateResource(id, { lastOpened: new Date().toISOString() }).catch(() => {})
      }
    }
  }, [id, getResourceById, updateResource, trackOpen])

  const handleSave = useCallback(
    async (data: Partial<Resource>) => {
      if (!resource) return
      await updateResource(resource.id, data)
      setResource({ ...resource, ...data })
      setShowEditModal(false)
      toast.success('Resource updated')
    },
    [resource, updateResource],
  )

  const handleDelete = useCallback(async () => {
    if (!resource) return
    setIsDeleting(true)
    try {
      await removeFile(resource.fileId)
      await deleteResource(resource.id)
      toast.success('Resource deleted')
      navigate('/library')
    } catch (err) {
      toast.error('Failed to delete resource')
    } finally {
      setIsDeleting(false)
    }
  }, [resource, deleteResource, removeFile, navigate])

  if (!resource) {
    return (
      <div className="p-4 lg:p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  const mod = getModule(resource.module)
  const tags = parseTags(resource.tags)

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-2">
          <Link
            to="/library"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <PageHeader title={resource.title} className="flex-1 mb-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FilePreview fileId={resource.fileId} />
          </div>

          <div className="space-y-4">
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={resource.favorite ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    handleSave({ favorite: !resource.favorite })
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${resource.favorite ? 'fill-current' : ''}`}
                  />
                  Favorite
                </Button>
                <Button
                  variant={resource.needRevision ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    handleSave({ needRevision: !resource.needRevision })
                  }}
                >
                  <BookMarked className="h-4 w-4" />
                  Revise
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FolderOpen className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">Module:</span>
                  <span className="text-text-primary font-medium">{resource.module}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">Type:</span>
                  <Badge>{resource.resourceType}</Badge>
                </div>
                {resource.topic && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-text-muted" />
                    <span className="text-text-secondary">Topic:</span>
                    <span className="text-text-primary">{resource.topic}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">Uploaded:</span>
                  <span className="text-text-primary">
                    {formatDate(resource.uploadDate)}
                  </span>
                </div>
              </div>

              {resource.description && (
                <div>
                  <p className="text-xs text-text-muted mb-1">Description</p>
                  <p className="text-sm text-text-secondary">{resource.description}</p>
                </div>
              )}

              {tags.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowEditModal(true)}
              >
                <Edit3 className="h-4 w-4" />
                Edit Metadata
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Metadata"
        >
          <MetadataEditor
            resource={resource}
            onSave={handleSave}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Resource"
          size="sm"
        >
          <DeleteDialog
            title={resource.title}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        </Modal>
      </div>
    </ErrorBoundary>
  )
}
