'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { ContentVersion } from '@/types'

export function CoversSection({ version }: { version: ContentVersion }) {
  const covers = version.covers || []
  const [heroIndex, setHeroIndex] = useState(0)

  if (covers.length === 0) return null

  return (
    <section id="covers" className="min-h-screen flex flex-col md:flex-row p-4 md:p-8 lg:p-12 gap-4 md:gap-8 items-center justify-center">
      <div className="flex-1 w-full aspect-video md:aspect-auto md:h-[80vh] relative rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={urlFor(covers[heroIndex]).width(1200).url()}
          alt={`Hero cover ${heroIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex md:flex-col gap-4 w-full md:w-auto overflow-x-auto md:overflow-visible pb-4 md:pb-0">
        {covers.map((cover, idx) => (
          <button
            key={idx}
            onClick={() => setHeroIndex(idx)}
            className={cn(
              "relative min-w-[100px] w-[100px] md:w-[160px] aspect-video rounded-lg overflow-hidden transition-all duration-300 border-2",
              heroIndex === idx ? "border-[var(--accent)] scale-105 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={urlFor(cover).width(200).url()}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
