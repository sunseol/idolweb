import type { PortableTextBlock, Image } from 'sanity'

export interface Theme {
  accentColor?: string
  backgroundVariant?: 'dark' | 'light' | 'neon'
}

export interface SyncedLyric {
  timestamp: number
  text: string
}

export interface Track {
  title: string
  audioFile?: any
  audioURL?: string
  lrc?: string
  syncedLyrics?: SyncedLyric[] // Parsed result
}

export interface ContentVersion {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  theme?: Theme
  covers: Image[]
  lyrics?: PortableTextBlock[]
  epubURL?: string
  audioURL?: string // Legacy
  tracks?: Track[]
}
