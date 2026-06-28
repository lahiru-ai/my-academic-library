import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useTheme } from '@/hooks/useTheme'
import { useModules } from '@/hooks/useModules'
import { useResources } from '@/hooks/useResources'
import { RESOURCE_TYPES } from '@/utils/constants'
import { exportToCsv, importFromCsv } from '@/utils/csvParser'
import { clearAllLocalData, getSetting, setSetting } from '@/services/storageService'
import { toast } from 'sonner'
import {
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  Trash2,
} from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { modules } = useModules()
  const { resources, addResource } = useResources()

  const [defaultModule, setDefaultModule] = useState(
    () => getSetting('defaultModule', ''),
  )
  const [defaultType, setDefaultType] = useState(
    () => getSetting('defaultType', ''),
  )

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  const handleDefaultModule = (value: string) => {
    setDefaultModule(value)
    setSetting('defaultModule', value)
  }

  const handleDefaultType = (value: string) => {
    setDefaultType(value)
    setSetting('defaultType', value)
  }

  const handleExport = () => {
    try {
      exportToCsv(resources)
      toast.success('Metadata exported to CSV')
    } catch {
      toast.error('Failed to export CSV')
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const imported = importFromCsv(text)
        for (const item of imported) {
          await addResource({
            ...item,
            fileId: '',
            lastOpened: '',
          })
        }
        toast.success(`Imported ${imported.length} resources`)
        window.location.reload()
      } catch {
        toast.error('Failed to import CSV. Check the file format.')
      }
    }
    input.click()
  }

  const handleClearCache = () => {
    clearAllLocalData()
    toast.success('Local cache cleared')
    setTimeout(() => window.location.reload(), 1000)
  }

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-6 max-w-2xl space-y-6">
        <PageHeader title="Settings" description="Customize your experience" />

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light' as const, icon: Sun, label: 'Light' },
                { value: 'dark' as const, icon: Moon, label: 'Dark' },
                { value: 'system' as const, icon: Monitor, label: 'System' },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                    theme === value
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/30'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      theme === value ? 'text-accent' : 'text-text-muted'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === value ? 'text-accent' : 'text-text-secondary'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Defaults</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="default-module"
              label="Default Module"
              value={defaultModule}
              onChange={(e) => handleDefaultModule(e.target.value)}
              placeholder="None"
              options={modules
                .filter((m) => !m.archived)
                .map((m) => ({ value: m.name, label: m.name }))}
            />
            <Select
              id="default-type"
              label="Default Resource Type"
              value={defaultType}
              onChange={(e) => handleDefaultType(e.target.value)}
              placeholder="None"
              options={RESOURCE_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Data Management</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="secondary" onClick={handleImport}>
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Button variant="danger" onClick={handleClearCache}>
              <Trash2 className="h-4 w-4" />
              Clear Cache
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            Export downloads all resource metadata as a CSV file. Import reads a CSV file
            and adds resources to your library. Clearing cache removes local data but does
            not affect your Google Drive or Sheets.
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <h3 className="text-sm font-semibold text-text-primary">About</h3>
          <p className="text-sm text-text-secondary">My Academic Library v1.0.0</p>
          <p className="text-sm text-text-secondary">
            A personal cloud-based academic library powered by Google Drive &amp; Sheets.
          </p>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
