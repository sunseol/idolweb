import type { PortableTextBlock, Image } from 'sanity'

export interface Theme {
  accentColor?: string
  backgroundVariant?: 'dark' | 'light' | 'neon'
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
  audioURL?: string
}
