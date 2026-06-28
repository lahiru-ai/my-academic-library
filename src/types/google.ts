export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  iconLink?: string
  size?: string
}

export interface GoogleUserProfile {
  email: string
  name: string
  picture: string
  sub: string
}

export interface SheetRow {
  id: string
  title: string
  module: string
  resourceType: string
  topic: string
  tags: string
  description: string
  fileId: string
  uploadDate: string
  favorite: string
  needRevision: string
  lastOpened: string
}
