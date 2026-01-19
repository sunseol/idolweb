import { PortableText } from '@portabletext/react'
import type { ContentVersion } from '@/types'

export function LyricsSection({ version }: { version: ContentVersion }) {
  if (!version.lyrics) return null

  return (
    <section id="lyrics" className="min-h-screen flex flex-col items-center justify-center p-8 md:p-24 text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-[var(--accent)]">Lyrics</h2>
      
      <div className="prose dark:prose-invert prose-lg md:prose-2xl max-w-4xl w-full leading-relaxed tracking-wide font-medium opacity-90">
        <PortableText value={version.lyrics} />
      </div>
    </section>
  )
}
