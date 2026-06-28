import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { FileQuestion } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary p-4">
      <div className="text-center">
        <FileQuestion className="h-16 w-16 text-text-muted mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-text-primary mb-2">Page not found</h1>
        <p className="text-text-secondary mb-6">
          The page you are looking for does not exist.
        </p>
        <Link to="/">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
