// src/components/animations/VideoBackground.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface VideoBackgroundProps {
  src?: string
  poster?: string
  className?: string
  children?: React.ReactNode
}

export function VideoBackground({ 
  src = "/videos/data-visualization-bg.mp4", 
  poster,
  className = "",
  children 
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([])

  // Initialize client-side only features
  useEffect(() => {
    setIsClient(true)
    // Generate particles on client side only
    const particleData = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${5 + Math.random() * 6}s`
    }))
    setParticles(particleData)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    
    const handleVideoLoad = () => {
      setVideoLoaded(true)
      // Animate video in when loaded
      if (video) {
        gsap.fromTo(video, 
          { opacity: 0, scale: 1.1 },
          { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
        )
      }
    }

    const handleVideoError = () => {
      setVideoError(true)
      console.warn('Video failed to load, using fallback background')
      // Show fallback background
      if (fallbackRef.current) {
        gsap.to(fallbackRef.current, {
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        })
      }
    }

    if (video) {
      video.addEventListener('loadeddata', handleVideoLoad)
      video.addEventListener('error', handleVideoError)
      
      // Ensure video plays
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(handleVideoError)
      }
    }

    // Animate overlay
    const ctx = gsap.context(() => {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0.6,
          duration: 2,
          ease: "power2.inOut",
          delay: 0.5
        })
      }
    })

    return () => {
      ctx.revert()
      if (video) {
        video.removeEventListener('loadeddata', handleVideoLoad)
        video.removeEventListener('error', handleVideoError)
      }
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fallback Background */}
      <div 
        ref={fallbackRef}
        className={`absolute inset-0 bg-gradient-to-br from-data-primary via-data-secondary to-data-accent transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 video-optimized ${videoError ? 'opacity-0' : 'opacity-100'}`}
        autoPlay
        muted
        loop
        playsInline
        {...(poster && { poster })}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Enhanced Video Overlay with Gradient */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60 opacity-0"
      ></div>

      {/* Additional Visual Effects */}
      <div className="absolute inset-0">
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20"></div>
        
        {/* Floating particles overlay - client side only */}
        {isClient && particles.map((particle, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* Loading indicator */}
      {!videoLoaded && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin video-loading"></div>
        </div>
      )}

      {/* Video Controls (subtle, bottom-right corner) */}
      {videoLoaded && !videoError && (
        <div className="absolute bottom-4 right-4 z-30">
          <button
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play()
                } else {
                  videoRef.current.pause()
                }
              }
            }}
            className="w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm"
            aria-label="Toggle video playback"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// Particle animation styles (add to globals.css)
export const particleStyles = `
@keyframes float-up {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

.particle {
  animation: float-up linear infinite;
}
`
