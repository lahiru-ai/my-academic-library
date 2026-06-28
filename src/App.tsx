import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ModuleProvider } from '@/contexts/ModuleContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/components/auth/LoginPage'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { lazy, Suspense } from 'react'
import { PageSkeleton } from '@/components/common/Skeleton'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const LibraryPage = lazy(() => import('@/pages/LibraryPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const RevisionPage = lazy(() => import('@/pages/RevisionPage'))
const UploadPage = lazy(() => import('@/pages/UploadPage'))
const ResourceDetailPage = lazy(() => import('@/pages/ResourceDetailPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <PageSkeleton />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageSkeleton />

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/revision" element={<RevisionPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <ModuleProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
              <Toaster
                position="bottom-right"
                theme="system"
                toastOptions={{
                  style: {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                  },
                }}
              />
            </ModuleProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
