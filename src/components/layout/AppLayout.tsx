import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <div className="lg:pl-60 pb-16 lg:pb-0">
        <TopBar />
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
