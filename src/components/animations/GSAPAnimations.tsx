// src/components/animations/GSAPAnimations.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Hero text animation component
export function HeroTextAnimation({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      
      // Animate each word in the hero text
      const words = containerRef.current?.querySelectorAll('.hero-word')
      if (words) {
        gsap.set(words, { opacity: 0, y: 50, rotationX: -90 })
        
        tl.to(words, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)"
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="hero-text-container">
      {children}
    </div>
  )
}

// Floating elements animation
export function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll('.floating-element')
      
      elements?.forEach((element, index) => {
        gsap.to(element, {
          y: -20,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: index * 0.3
        })
        
        gsap.to(element, {
          rotation: 360,
          duration: 20 + index * 5,
          repeat: -1,
          ease: "none"
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isClient])

  if (!isClient) {
    return <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="floating-element absolute top-20 left-10 w-4 h-4 bg-data-primary/20 rounded-full blur-sm"></div>
      <div className="floating-element absolute top-40 right-20 w-6 h-6 bg-data-secondary/20 rounded-full blur-sm"></div>
      <div className="floating-element absolute bottom-40 left-20 w-3 h-3 bg-data-accent/20 rounded-full blur-sm"></div>
      <div className="floating-element absolute bottom-20 right-10 w-5 h-5 bg-data-success/20 rounded-full blur-sm"></div>
      <div className="floating-element absolute top-1/3 left-1/4 w-2 h-2 bg-data-warning/20 rounded-full blur-sm"></div>
      <div className="floating-element absolute top-2/3 right-1/3 w-4 h-4 bg-data-primary/30 rounded-full blur-sm"></div>
    </div>
  )
}

// Parallax section animation - Optimized for performance
export function ParallaxSection({ children, speed = 0.5 }: { 
  children: React.ReactNode
  speed?: number 
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const ctx = gsap.context(() => {
      const element = sectionRef.current
      if (!element) return

      gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [speed, isClient])

  if (!isClient) {
    return <div className="parallax-section">{children}</div>
  }

  return (
    <div ref={sectionRef} className="parallax-section">
      {children}
    </div>
  )
}

// Card reveal animation - Optimized for better content visibility
export function RevealOnScroll({ children, delay = 0 }: { 
  children: React.ReactNode
  delay?: number 
}) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(elementRef.current, { 
        opacity: 0.3, // Start slightly visible instead of completely hidden
        y: 52, // Reduce initial offset
        scale: 0.95, // Less dramatic scale change
        rotationY: -5 // Subtle rotation
      })
      
      gsap.to(elementRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.8, // Faster animation
        delay: Math.min(delay, 0.3), // Cap delay at 0.3s
        ease: "power2.out", // Smoother easing
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 95%", // Trigger much earlier in viewport
          toggleActions: "play none none reverse"
        }
      })
    }, elementRef)

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={elementRef} className="reveal-element">
      {children}
    </div>
  )
}

// Immediate reveal - for critical content that should be visible right away
export function InstantReveal({ children }: { children: React.ReactNode }) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(elementRef.current, { 
        opacity: 0.8, // Start mostly visible
        y: 25, // Minimal offset
        scale: 0.98 // Barely noticeable scale
      })
      
      gsap.to(elementRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5, // Very fast animation
        ease: "power1.out",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 98%", // Trigger almost immediately when in viewport
          toggleActions: "play none none reverse"
        }
      })
    }, elementRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={elementRef} className="instant-reveal">
      {children}
    </div>
  )
}

// Magnetic button effect
export function MagneticButton({ children, className = "" }: { 
  children: React.ReactNode
  className?: string 
}) {
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      })
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={buttonRef} className={`magnetic-button ${className}`}>
      {children}
    </div>
  )
}

// Counter animation
export function AnimatedCounter({ 
  end, 
  duration = 2, 
  suffix = "" 
}: { 
  end: number
  duration?: number
  suffix?: string 
}) {
  const counterRef = useRef<HTMLSpanElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [displayValue, setDisplayValue] = useState(`0${suffix}`)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const ctx = gsap.context(() => {
      const obj = { value: 0 }
      
      gsap.to(obj, {
        value: end,
        duration: Math.min(duration, 1.5), // Cap duration for responsiveness
        ease: "power2.out",
        onUpdate: () => {
          const newValue = Math.round(obj.value).toLocaleString() + suffix
          setDisplayValue(newValue)
        },
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 90%", // Trigger earlier
          toggleActions: "play none none none"
        }
      })
    }, counterRef)

    return () => ctx.revert()
  }, [end, duration, suffix, isClient])

  return <span ref={counterRef}>{displayValue}</span>
}

// Data visualization animation
export function DataVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bars = containerRef.current?.querySelectorAll('.data-bar')
      const lines = containerRef.current?.querySelectorAll('.data-line')
      
      // Animate bars
      if (bars) {
        gsap.set(bars, { scaleY: 0.1, transformOrigin: "bottom" }) // Start slightly visible
        gsap.to(bars, {
          scaleY: 1,
          duration: 1, // Faster animation
          stagger: 0.08,
          ease: "back.out(1.2)", // Less bouncy
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Trigger earlier
            toggleActions: "play none none reverse"
          }
        })
      }

      // Animate lines
      if (lines) {
        lines.forEach((line) => {
          gsap.set(line, { strokeDasharray: "1000", strokeDashoffset: "1000" })
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 1.5, // Faster line animation
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: line,
              start: "top 90%", // Trigger much earlier
              toggleActions: "play none none reverse"
            }
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-64 bg-muted/20 rounded-lg p-6">
      {/* Simple bar chart visualization */}
      <div className="flex items-end justify-center gap-2 h-full">
        <div className="data-bar w-8 h-16 bg-data-primary rounded-t"></div>
        <div className="data-bar w-8 h-24 bg-data-secondary rounded-t"></div>
        <div className="data-bar w-8 h-20 bg-data-accent rounded-t"></div>
        <div className="data-bar w-8 h-32 bg-data-success rounded-t"></div>
        <div className="data-bar w-8 h-12 bg-data-warning rounded-t"></div>
        <div className="data-bar w-8 h-36 bg-data-primary rounded-t"></div>
      </div>
      
      {/* Animated line overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path 
          className="data-line"
          d="M 50 200 Q 150 100 250 150 T 450 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
