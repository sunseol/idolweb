'use client'

import { useEffect, useRef, useState } from 'react'
import ePub, { type Book, type Rendition } from 'epubjs'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EpubViewerProps {
  url: string
}

export function EpubViewer({ url }: EpubViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<Book | null>(null)
  const renditionRef = useRef<Rendition | null>(null)
  
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [isSpread, setIsSpread] = useState(false)

  useEffect(() => {
    if (!url || !viewerRef.current) return

    if (bookRef.current) {
      bookRef.current.destroy()
    }

    try {
      const book = ePub(url)
      bookRef.current = book

      const initialSpread = window.innerWidth >= 1024
      setIsSpread(initialSpread)

      const rendition = book.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        spread: initialSpread ? 'always' : 'none',
        allowScriptedContent: true,
      })
      renditionRef.current = rendition

      rendition.display().then(() => {
        setIsReady(true)
        updateLocationState(rendition)
      })

      // Fix: Handle internal links (TOC) to prevent 404
      rendition.on('linkClicked', (href: string) => {
        // e.preventDefault() is redundant here as epub.js handles it, 
        // but we need to ensure it uses rendition.display()
        console.log('Link clicked:', href)
        // If href contains anchor
        if (href.indexOf('#') > -1) {
             const target = href.substring(href.indexOf('#')) // Get ID
             rendition.display(target)
        } else {
             // If file path
             rendition.display(href)
        }
      })

      // Keyboard Navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') rendition.next()
        if (e.key === 'ArrowLeft') rendition.prev()
      }
      document.addEventListener('keydown', handleKeyDown)

      rendition.on('relocated', (location: any) => {
        updateLocationState(rendition)
      })

      let touchStartX = 0
      let touchEndX = 0

      rendition.on('touchstart', (e: TouchEvent) => {
        touchStartX = e.changedTouches[0].screenX
      })

      rendition.on('touchend', (e: TouchEvent) => {
        touchEndX = e.changedTouches[0].screenX
        handleSwipe()
      })

      const handleSwipe = () => {
        const threshold = 50
        if (touchEndX < touchStartX - threshold) {
          rendition.next()
        }
        if (touchEndX > touchStartX + threshold) {
          rendition.prev()
        }
      }

    } catch (err) {
      console.error('EPUB Init Error:', err)
      setError('Failed to load EPUB file.')
    }

    return () => {
      if (bookRef.current) {
        bookRef.current.destroy()
      }
    }
  }, [url])

  useEffect(() => {
    const handleResize = () => {
      if (!renditionRef.current) return
      
      const width = window.innerWidth
      const newIsSpread = width >= 1024

      if (newIsSpread !== isSpread) {
        setIsSpread(newIsSpread)
        renditionRef.current.spread(newIsSpread ? 'always' : 'none')
        renditionRef.current.resize(width >= 1024 ? '100%' : '100%') 
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isSpread])

  const updateLocationState = (rendition: Rendition) => {
    const location = rendition.location
    if (location) {
      setAtStart(location.atStart)
      setAtEnd(location.atEnd)
    }
  }

  const handlePrev = () => renditionRef.current?.prev()
  const handleNext = () => renditionRef.current?.next()

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
          <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
        </div>
      )}

      {/* Desktop Navigation Buttons */}
      <button
        onClick={handlePrev}
        disabled={atStart}
        className={cn(
          "absolute left-4 z-20 p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hidden md:block",
          !atStart && "hover:bg-[var(--accent)] hover:text-white"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={24} />
      </button>

      <div ref={viewerRef} className="w-full h-full bg-white dark:bg-gray-100 shadow-sm rounded-lg overflow-hidden" />

      <button
        onClick={handleNext}
        disabled={atEnd}
        className={cn(
          "absolute right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hidden md:block",
          !atEnd && "hover:bg-[var(--accent)] hover:text-white"
        )}
        aria-label="Next page"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}
