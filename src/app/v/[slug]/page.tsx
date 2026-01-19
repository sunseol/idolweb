import { client } from '@/sanity/lib/client'
import { VERSION_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { DotNavigation } from '@/components/ui/DotNavigation'
import { notFound } from 'next/navigation'
import type { ContentVersion } from '@/types'

import { CoversSection } from '@/components/sections/CoversSection'
import { LyricsSection } from '@/components/sections/LyricsSection'
import { EpubSection } from '@/components/sections/EpubSection'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export default async function VersionPage({ params }: PageProps) {
  const version = await client.fetch<ContentVersion>(VERSION_BY_SLUG_QUERY, {
    slug: params.slug,
  })

  if (!version) {
    notFound()
  }

  const accentColor = version.theme?.accentColor || '#000000'
  const isDark = version.theme?.backgroundVariant === 'dark' || version.theme?.backgroundVariant === 'neon'

  const themeStyle = {
    '--accent': accentColor,
    backgroundColor: isDark ? '#111' : '#fff',
    color: isDark ? '#fff' : '#000',
  } as React.CSSProperties

  return (
    <div style={themeStyle} className="min-h-screen transition-colors duration-500">
      <DotNavigation />
      
      <main className="w-full">
        <CoversSection version={version} />
        <LyricsSection version={version} />
        <EpubSection version={version} />
      </main>
    </div>
  )
}
