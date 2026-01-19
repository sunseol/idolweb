'use client'

import type { ContentVersion } from '@/types'

import { EpubViewer } from './EpubViewer'

export function EpubSection({ version }: { version: ContentVersion }) {
  return (
    <section id="epub" className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-8 text-[var(--accent)]">Study Material</h2>
      <div className="w-full max-w-6xl h-[70vh] md:h-[80vh] flex items-center justify-center relative">
        {version.epubURL ? (
          <EpubViewer url={version.epubURL} />
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl w-full">
            <p className="text-gray-500">No EPUB file available</p>
          </div>
        )}
      </div>
    </section>
  )
}
