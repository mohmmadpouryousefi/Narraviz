// src/components/animations/OptimizedAnimations.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

// More performance-friendly animation components

// Reduced motion parallax effect
export function LightParallax({ children, intensity = 0.3 }: { 
  children: React.ReactNode
  intensity?: number 
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const element = sectionRef.current
    if (!element) return

    let ticking = false

    const updateParallax = () => {
      const rect = element.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * -intensity

      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        element.style.transform = `translate3d(0, ${rate}px, 0)`
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [intensity, isClient])

  if (!isClient) {
    return <div>{children}</div>
  }

  return (
    <div ref={sectionRef} className="will-change-transform">
      {children}
    </div>
  )
}

// CSS-only parallax alternative
export function CSSParallax({ children }: { children: React.ReactNode }) {
  return (
    <div className="css-parallax-container">
      <div className="css-parallax-content">
        {children}
      </div>
    </div>
  )
}
