'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, Disc } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { ContentVersion } from '@/types'

export function AudioSection({ version }: { version: ContentVersion }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Visualizer dummy bars
  const [bars, setBars] = useState<number[]>([])

  useEffect(() => {
    setBars(Array.from({ length: 40 }, () => Math.random() * 40 + 10))
  }, [])

  if (!version.audioURL) return null

  const heroImage = version.covers && version.covers[0]

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration || 1
      setProgress((current / duration) * 100)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (audioRef.current) {
      const duration = audioRef.current.duration || 1
      audioRef.current.currentTime = (value / 100) * duration
      setProgress(value)
    }
  }

  return (
    <section id="audio" className="min-h-screen flex flex-col items-center justify-center p-8 bg-black/90 text-white relative overflow-hidden">
      {/* Background Blur */}
      {heroImage && (
        <div className="absolute inset-0 z-0 opacity-30 blur-3xl scale-125">
          <Image
            src={urlFor(heroImage).width(800).url()}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="z-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Album Art (Rotating) */}
        <div className={cn(
          "relative w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl border-4 border-white/10 overflow-hidden flex-shrink-0 transition-transform duration-[10s] ease-linear",
          isPlaying ? "animate-spin-slow" : ""
        )}>
          {heroImage ? (
            <Image
              src={urlFor(heroImage).width(600).url()}
              alt={version.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Disc size={64} className="text-gray-600" />
            </div>
          )}
          {/* Center Hole */}
          <div className="absolute inset-0 m-auto w-16 h-16 bg-black rounded-full border-2 border-gray-700" />
        </div>

        {/* Player Controls */}
        <div className="flex-1 w-full backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-xl">
          <h2 className="text-3xl font-bold mb-2 truncate">{version.title}</h2>
          <p className="text-gray-300 mb-8 text-sm uppercase tracking-widest">Now Playing</p>

          <audio
            ref={audioRef}
            src={version.audioURL}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Visualizer */}
          <div className="flex items-end justify-center gap-1 h-12 mb-6 opacity-60">
            {bars.map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-[var(--accent)] rounded-t-sm transition-all duration-300"
                style={{ 
                  height: isPlaying ? `${height}%` : '10%',
                  backgroundColor: version.theme?.accentColor || '#fff' 
                }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden group cursor-pointer">
              <div 
                className="absolute top-0 left-0 h-full bg-[var(--accent)] transition-all duration-100"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: version.theme?.accentColor || '#fff'
                }} 
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={toggleMute}
                className="p-3 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-[var(--accent)] text-black shadow-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: version.theme?.accentColor || '#fff' }}
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" ml-1 />}
              </button>
              
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
