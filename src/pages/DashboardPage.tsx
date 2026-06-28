import { useResources } from '@/hooks/useResources'
import { useModules } from '@/hooks/useModules'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { ModuleProgress } from '@/components/dashboard/ModuleProgress'
import { RecentResources } from '@/components/dashboard/RecentResources'
import { StorageChart } from '@/components/dashboard/StorageChart'
import { PageSkeleton } from '@/components/common/Skeleton'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { BookOpen, Heart, BookMarked, FolderOpen } from 'lucide-react'

export default function DashboardPage() {
  const { resources, isLoading } = useResources()
  const { modules } = useModules()

  if (isLoading) return <PageSkeleton />

  const totalResources = resources.length
  const totalModules = modules.filter((m) => !m.archived).length
  const favoritesCount = resources.filter((r) => r.favorite).length
  const revisionCount = resources.filter((r) => r.needRevision).length

  const recentUploaded = [...resources]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5)

  const recentOpened = [...resources]
    .filter((r) => r.lastOpened)
    .sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime())
    .slice(0, 5)

  const moduleProgress = modules.map((m) => ({
    ...m,
    resourceCount: resources.filter((r) => r.module === m.name).length,
  }))

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-6 space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your academic library"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Total Resources"
            value={totalResources}
          />
          <StatCard
            icon={<FolderOpen className="h-5 w-5" />}
            label="Active Modules"
            value={totalModules}
          />
          <StatCard
            icon={<Heart className="h-5 w-5" />}
            label="Favorites"
            value={favoritesCount}
          />
          <StatCard
            icon={<BookMarked className="h-5 w-5" />}
            label="Need Revision"
            value={revisionCount}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModuleProgress modules={moduleProgress} />
          <StorageChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentResources
            resources={recentUploaded}
            title="Recently Added"
            emptyMessage="No resources yet. Upload your first resource!"
          />
          <RecentResources
            resources={recentOpened}
            title="Recently Opened"
            emptyMessage="No recent activity"
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
