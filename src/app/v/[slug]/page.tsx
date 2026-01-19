import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { VERSION_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { DotNavigation } from '@/components/ui/DotNavigation'
import { notFound } from 'next/navigation'
import type { ContentVersion } from '@/types'

import { CoversSection } from '@/components/sections/CoversSection'
import { LyricsSection } from '@/components/sections/LyricsSection'
import { EpubSection } from '@/components/sections/EpubSection'
import { AudioSection } from '@/components/sections/AudioSection'

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
      <Link 
        href="/" 
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 p-3 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md shadow-lg hover:bg-black/20 dark:hover:bg-white/20 transition-all border border-white/20 group"
        aria-label="Back to Home"
      >
        <ArrowLeft size={24} className="text-black dark:text-white group-hover:-translate-x-1 transition-transform" />
      </Link>

      <DotNavigation />
      
      <main className="w-full">
        <CoversSection version={version} />
        <LyricsSection version={version} />
        {version.audioURL && <AudioSection version={version} />}
        <EpubSection version={version} />
      </main>
    </div>
  )
}
