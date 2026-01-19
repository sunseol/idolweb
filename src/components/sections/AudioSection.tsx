'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContentVersion } from '@/types'

export function AudioSection({ version }: { version: ContentVersion }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  if (!version.audioURL) return null

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
      const duration = audioRef.current.duration
      setProgress((current / duration) * 100)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (audioRef.current) {
      const duration = audioRef.current.duration
      audioRef.current.currentTime = (value / 100) * duration
      setProgress(value)
    }
  }

  return (
    <section id="audio" className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-black text-white">
      <h2 className="text-3xl font-bold mb-8 text-[var(--accent)]">Listen</h2>
      
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
        <audio
          ref={audioRef}
          src={version.audioURL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="flex flex-col gap-6">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            style={{ '--accent': version.theme?.accentColor || '#fff' } as React.CSSProperties}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--accent)] text-black hover:scale-110 transition-transform"
                style={{ backgroundColor: version.theme?.accentColor || '#fff' }}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" ml-1 />}
              </button>
              
              <div className="text-sm font-medium text-gray-400">
                {version.title} - Audio Track
              </div>
            </div>

            <button
              onClick={toggleMute}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
