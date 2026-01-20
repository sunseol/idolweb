'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, Disc, SkipBack, SkipForward } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import type { ContentVersion, Track, SyncedLyric } from '@/types'

const parseLrc = (lrcString: string): SyncedLyric[] => {
  if (!lrcString) return []
  const lines = lrcString.split('\n')
  const result: SyncedLyric[] = []
  
  const timeRegex = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?\]/

  lines.forEach(line => {
    const match = timeRegex.exec(line)
    if (match) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const milliseconds = match[4] ? parseInt(match[4].padEnd(3, '0')) : 0
      const timestamp = minutes * 60 + seconds + milliseconds / 1000
      const text = line.replace(timeRegex, '').trim()
      
      if (text) {
        result.push({ timestamp, text })
      }
    }
  })
  
  return result.sort((a, b) => a.timestamp - b.timestamp)
}

export function AudioSection({ version }: { version: ContentVersion }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1)
  const [bars, setBars] = useState<number[]>([])

  const tracks: Track[] = useMemo(() => {
    if (version.tracks && version.tracks.length > 0) {
      return version.tracks.map(track => ({
        ...track,
        syncedLyrics: track.lrc ? parseLrc(track.lrc) : (track.syncedLyrics || [])
      }))
    } else if (version.audioURL) {
      return [{
        title: version.title,
        audioURL: version.audioURL,
        syncedLyrics: []
      }]
    }
    return []
  }, [version])

  const currentTrack = tracks[currentTrackIndex]
  const heroImage = version.covers && version.covers[currentTrackIndex % version.covers.length]

  useEffect(() => {
    setBars(Array.from({ length: 40 }, () => Math.random() * 40 + 10))
  }, [])

  useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentLyricIndex(-1)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [currentTrackIndex])

  if (!currentTrack) return null

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

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
  }

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration || 1
      setProgress((currentTime / duration) * 100)

      if (currentTrack.syncedLyrics && currentTrack.syncedLyrics.length > 0) {
        const lyrics = currentTrack.syncedLyrics
        let activeIndex = -1
        for (let i = 0; i < lyrics.length; i++) {
          if (currentTime >= lyrics[i].timestamp) {
            activeIndex = i
          } else {
            break
          }
        }
        
        if (activeIndex !== currentLyricIndex) {
          setCurrentLyricIndex(activeIndex)
          const activeElement = document.getElementById(`lyric-${activeIndex}`)
          if (activeElement && lyricsRef.current) {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }
        }
      }
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

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section id="audio" className="min-h-screen flex flex-col items-center justify-center p-8 bg-black/90 text-white relative overflow-hidden">
      {heroImage && (
        <div className="absolute inset-0 z-0 opacity-30 blur-3xl scale-125 transition-all duration-1000">
          <Image
            src={urlFor(heroImage).width(800).url()}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrackIndex}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative w-full h-full rounded-full shadow-2xl border-4 border-white/10 overflow-hidden cursor-grab active:cursor-grabbing",
                  isPlaying ? "animate-spin-slow" : ""
                )}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    handleNextTrack();
                  } else if (swipe > swipeConfidenceThreshold) {
                    handlePrevTrack();
                  }
                }}
              >
                {heroImage ? (
                  <Image
                    src={urlFor(heroImage).width(800).url()}
                    alt={version.title}
                    fill
                    className="object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Disc size={64} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 m-auto w-20 h-20 bg-black rounded-full border-2 border-gray-700 z-10" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 truncate px-4">{currentTrack.title}</h2>
            <p className="text-gray-400 text-sm">{currentTrackIndex + 1} / {tracks.length}</p>
          </div>

          <div className="w-full backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/20 shadow-xl">
            <audio
              ref={audioRef}
              src={currentTrack.audioURL}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleNextTrack}
            />

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

              <div className="flex items-center justify-between px-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <div className="flex items-center gap-6">
                  <button onClick={handlePrevTrack} className="p-2 hover:text-[var(--accent)] transition-colors">
                    <SkipBack size={28} />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-[var(--accent)] text-black shadow-lg hover:scale-105 transition-transform"
                    style={{ backgroundColor: version.theme?.accentColor || '#fff' }}
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" ml-1 />}
                  </button>

                  <button onClick={handleNextTrack} className="p-2 hover:text-[var(--accent)] transition-colors">
                    <SkipForward size={28} />
                  </button>
                </div>
                
                <div className="w-9" />
              </div>
            </div>
          </div>
        </div>

        {currentTrack.syncedLyrics && currentTrack.syncedLyrics.length > 0 && (
          <div className="flex-1 w-full h-[60vh] backdrop-blur-sm bg-black/40 rounded-3xl p-8 border border-white/10 shadow-inner overflow-hidden relative mask-image-gradient">
            <div 
              ref={lyricsRef}
              className="h-full overflow-y-auto no-scrollbar scroll-smooth space-y-6 text-center py-[25vh]"
            >
              {currentTrack.syncedLyrics.map((lyric, idx) => (
                <motion.p
                  id={`lyric-${idx}`}
                  key={idx}
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ 
                    opacity: currentLyricIndex === idx ? 1 : 0.4, 
                    scale: currentLyricIndex === idx ? 1.1 : 0.95,
                    color: currentLyricIndex === idx ? (version.theme?.accentColor || '#fff') : '#aaa'
                  }}
                  className={cn(
                    "text-lg md:text-2xl font-medium transition-all duration-300 cursor-pointer hover:opacity-80",
                    currentLyricIndex === idx && "font-bold shadow-glow"
                  )}
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = lyric.timestamp
                    }
                  }}
                >
                  {lyric.text}
                </motion.p>
              ))}
            </div>
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </section>
  )
}
