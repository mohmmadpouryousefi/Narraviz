"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Register the ScrollToPlugin
    gsap.registerPlugin(ScrollToPlugin);
  }, []);

  const handleSmoothScroll = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: target,
           // Account for sticky navbar height
        },
        ease: "power2.inOut",
      });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 h-16">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-story-gradient rounded-lg flex items-center justify-center animate-pulse-primary">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-story-gradient bg-clip-text text-transparent">
              Narraviz
            </h1>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleSmoothScroll("features")}
              className="text-sm font-medium hover:text-data-primary transition-all duration-300 cursor-pointer relative group px-2 py-1 rounded-md hover:bg-data-primary/5"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-data-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handleSmoothScroll("how-it-works")}
              className="text-sm font-medium hover:text-data-primary transition-all duration-300 cursor-pointer relative group px-2 py-1 rounded-md hover:bg-data-primary/5"
            >
              How it Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-data-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handleSmoothScroll("pricing")}
              className="text-sm font-medium hover:text-data-primary transition-all duration-300 cursor-pointer relative group px-2 py-1 rounded-md hover:bg-data-primary/5"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-data-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-data-primary hover:bg-data-primary/90"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-5 h-5 flex flex-col justify-between">
              <div className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur-sm">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <button
                onClick={() => handleSmoothScroll("features")}
                className="text-sm font-medium hover:text-data-primary transition-all duration-300 text-left py-2 px-3 rounded-md hover:bg-data-primary/5"
              >
                Features
              </button>
              <button
                onClick={() => handleSmoothScroll("how-it-works")}
                className="text-sm font-medium hover:text-data-primary transition-all duration-300 text-left py-2 px-3 rounded-md hover:bg-data-primary/5"
              >
                How it Works
              </button>
              <button
                onClick={() => handleSmoothScroll("pricing")}
                className="text-sm font-medium hover:text-data-primary transition-all duration-300 text-left py-2 px-3 rounded-md hover:bg-data-primary/5"
              >
                Pricing
              </button>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button variant="ghost" size="sm" className="justify-start">
                  Sign In
                </Button>
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="bg-data-primary hover:bg-data-primary/90 w-full"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
