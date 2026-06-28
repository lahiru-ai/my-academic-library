import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import { useState } from 'react'

export function TopBar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-text-primary hidden sm:block">
          My Academic Library
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {user && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="text-sm font-medium text-text-primary hidden sm:block">
                {user.name}
              </span>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl bg-surface border border-border shadow-lg z-20 py-1">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-danger transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
