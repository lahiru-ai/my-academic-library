import { PageHeader } from '@/components/layout/PageHeader'
import { UploadForm } from '@/components/upload/UploadForm'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export default function UploadPage() {
  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-6 max-w-3xl">
        <PageHeader
          title="Upload Resources"
          description="Upload files to Google Drive with metadata"
        />
        <UploadForm />
      </div>
    </ErrorBoundary>
  )
}
