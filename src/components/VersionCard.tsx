import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { ContentVersion } from '@/types'
import { cn } from '@/lib/utils'

export function VersionCard({ version }: { version: ContentVersion }) {
  const heroImage = version.covers && version.covers[0]
  const accentColor = version.theme?.accentColor || '#000000'
  
  return (
    <Link href={`/v/${version.slug.current}`} className="group block">
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
        style={{ borderColor: accentColor }}
      >
        {heroImage ? (
          <Image
            src={urlFor(heroImage).width(800).height(450).url()}
            alt={version.title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Cover
          </div>
        )}
        
        {/* Overlay gradient for text readability */}
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-white font-bold truncate">{version.title}</p>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-lg font-bold group-hover:text-[var(--accent)] transition-colors" style={{ '--accent': accentColor } as React.CSSProperties}>
          {version.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(version.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}
