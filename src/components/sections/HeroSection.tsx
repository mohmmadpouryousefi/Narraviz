// src/components/sections/HeroSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  BarChart3,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import {
  HeroTextAnimation,
  FloatingElements,
  RevealOnScroll,
  MagneticButton,
} from "@/components/animations/GSAPAnimations";
import { ClientOnly } from "@/components/ClientOnly";

export function HeroSection() {
  return (
    <section className="relative px-4 overflow-hidden h-screen flex items-center">
      {/* Video Background - Simplified */}
      <div className="absolute inset-0 overflow-hidden">
        <ClientOnly
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-data-primary via-data-secondary to-data-accent">
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          }
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadStart={() => console.log("Video loading started")}
            onCanPlay={() => console.log("Video can play")}
            onError={(e) => console.error("Video error:", e)}
          >
            <source
              src="/videos/data-visualization-bg.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </ClientOnly>

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>

        {/* Floating animated elements */}
        <ClientOnly>
          <FloatingElements />
        </ClientOnly>
      </div>

      <div className="container mx-auto text-center relative z-20 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <RevealOnScroll delay={0.2}>
            <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20 mb-6 text-xs px-4 py-2 font-medium">
              <Sparkles className="w-3 h-3 mr-2" />
              AI-Powered Data Storytelling Platform
            </Badge>
          </RevealOnScroll>

          <HeroTextAnimation>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
              <span className="hero-word inline-block">Transform</span>{" "}
              <span className="hero-word inline-block">Your</span>{" "}
              <span className="hero-word inline-block">Data</span>{" "}
              <span className="hero-word inline-block">Into</span>
              <span className="block mt-4">
                <span className="hero-word inline-block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Compelling
                </span>{" "}
                <span className="hero-word inline-block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Visual
                </span>{" "}
                <span className="hero-word inline-block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Stories
                </span>
              </span>
            </h1>
          </HeroTextAnimation>

          <RevealOnScroll delay={0.2}>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Turn raw data into compelling narratives in minutes, not hours.
              Our AI-powered platform automatically discovers insights,
              creates stunning visualizations, and builds interactive stories
              that engage stakeholders and drive results.
            </p>
          </RevealOnScroll>

          {/* What the product does (no user counts or ratings until they are real) */}
          <RevealOnScroll delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/80 mb-8">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-yellow-300" aria-hidden />
                <span className="font-medium">CSV in, story out</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-yellow-300" aria-hidden />
                <span className="font-medium">Automatic chart suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-300" aria-hidden />
                <span className="font-medium">Trends, outliers and correlations</span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-10">
              <MagneticButton>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-data-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-3 text-lg group backdrop-blur-sm"
                >
                  <PlayCircle className="w-5 h-5 mr-2 group-hover:text-yellow-300 transition-colors" />
                  Watch Demo
                </Button>
              </MagneticButton>
            </div>
          </RevealOnScroll>

          {/* Tech stack (no customer logos until there are real customers) */}
          <RevealOnScroll delay={0.5}>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm text-white/60 mb-4">
                Built with
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-80">
                {["Next.js", "TypeScript", "PostgreSQL", "Claude"].map((tech) => (
                  <div key={tech} className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-all duration-300">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
