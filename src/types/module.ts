export interface Module {
  id: string
  name: string
  color: string
  icon: string
  level: string
  semester: string
  resourceCount: number
  progress: number
  archived: boolean
}

export const DEFAULT_MODULES: Omit<Module, 'id' | 'resourceCount' | 'progress'>[] = [
  { name: 'CMIS1212', color: '#3b82f6', icon: 'Code', level: '', semester: '1', archived: false },
  { name: 'IMGT1212', color: '#10b981', icon: 'Image', level: '', semester: '1', archived: false },
  { name: 'IMGT1222', color: '#8b5cf6', icon: 'Image', level: '', semester: '2', archived: false },
  { name: 'MATH1212', color: '#f59e0b', icon: 'Sigma', level: '', semester: '1', archived: false },
  { name: 'MATH1222', color: '#ef4444', icon: 'Sigma', level: '', semester: '2', archived: false },
  { name: 'STAT1213', color: '#ec4899', icon: 'BarChart3', level: '', semester: '1', archived: false },
]
