import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/helpers'
import {
  LayoutDashboard,
  Library,
  Heart,
  BookMarked,
  Upload,
} from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/favorites', icon: Heart, label: 'Favs' },
  { to: '/revision', icon: BookMarked, label: 'Revise' },
]

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
