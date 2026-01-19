'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Circle, Disc, BookOpen, Music, Image as ImageIcon } from 'lucide-react'

const SECTIONS = [
  { id: 'covers', label: 'Covers', icon: ImageIcon },
  { id: 'lyrics', label: 'Lyrics', icon: Music },
  { id: 'epub', label: 'EPUB', icon: BookOpen },
]

export function DotNavigation() {
  const [activeSection, setActiveSection] = useState<string>('covers')

  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const element = document.getElementById(id)
      if (!element) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        { threshold: 0.5 } 
      )
      
      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={cn(
            "group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            activeSection === id 
              ? "bg-black text-white dark:bg-white dark:text-black scale-110 shadow-lg" 
              : "bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 opacity-70 hover:opacity-100"
          )}
          aria-label={`Scroll to ${label}`}
        >
          <Icon size={18} />
          
          <span className="absolute left-12 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap dark:bg-white dark:text-black pointer-events-none">
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
