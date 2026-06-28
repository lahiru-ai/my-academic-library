import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Module } from '@/types'
import { DEFAULT_MODULES } from '@/types'
import { generateId } from '@/utils/helpers'
import { STORAGE_KEYS } from '@/utils/constants'

interface ModuleContextType {
  modules: Module[]
  addModule: (module: Omit<Module, 'id' | 'resourceCount' | 'progress'>) => void
  updateModule: (id: string, data: Partial<Module>) => void
  archiveModule: (id: string) => void
  unarchiveModule: (id: string) => void
  deleteModule: (id: string) => void
  getModule: (name: string) => Module | undefined
  activeModules: Module[]
}

export const ModuleContext = createContext<ModuleContextType>({
  modules: [],
  addModule: () => {},
  updateModule: () => {},
  archiveModule: () => {},
  unarchiveModule: () => {},
  deleteModule: () => {},
  getModule: () => undefined,
  activeModules: [],
})

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MODULES)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEFAULT_MODULES.map((m) => ({ ...m, id: generateId() }))
      }
    }
    return DEFAULT_MODULES.map((m) => ({ ...m, id: generateId() }))
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules))
  }, [modules])

  const addModule = useCallback(
    (data: Omit<Module, 'id' | 'resourceCount' | 'progress'>) => {
      setModules((prev) => [
        ...prev,
        { ...data, id: generateId(), resourceCount: 0, progress: 0 },
      ])
    },
    [],
  )

  const updateModule = useCallback((id: string, data: Partial<Module>) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)))
  }, [])

  const archiveModule = useCallback((id: string) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, archived: true } : m)))
  }, [])

  const unarchiveModule = useCallback((id: string) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, archived: false } : m)))
  }, [])

  const deleteModule = useCallback((id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const getModule = useCallback(
    (name: string) => modules.find((m) => m.name === name),
    [modules],
  )

  const activeModules = useMemo(() => modules.filter((m) => !m.archived), [modules])

  const value = useMemo(
    () => ({
      modules,
      addModule,
      updateModule,
      archiveModule,
      unarchiveModule,
      deleteModule,
      getModule,
      activeModules,
    }),
    [modules, addModule, updateModule, archiveModule, unarchiveModule, deleteModule, getModule, activeModules],
  )

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
}
