import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/helpers'
import {
  LayoutDashboard,
  Library,
  Heart,
  BookMarked,
  Upload,
  Settings,
  GraduationCap,
} from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/revision', icon: BookMarked, label: 'Revision' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 bg-surface border-r border-border z-40">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <GraduationCap className="h-7 w-7 text-accent" />
        <span className="font-semibold text-lg text-text-primary">My Library</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-border">
        <p className="text-xs text-text-muted">My Academic Library</p>
        <p className="text-xs text-text-muted">v1.0.0</p>
      </div>
    </aside>
  )
}
