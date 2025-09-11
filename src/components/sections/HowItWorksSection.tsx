// src/components/sections/HowItWorksSection.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Database,
  Brain,
  Eye,
} from "lucide-react";
import {
  RevealOnScroll,
  InstantReveal,
  DataVisualization,
} from "@/components/animations/GSAPAnimations";
import { LightParallax } from "@/components/animations/OptimizedAnimations";
import { ClientOnly } from "@/components/ClientOnly";

export function HowItWorksSection() {
  return (
    <LightParallax intensity={0.2}>
      <section
        id="how-it-works"
        className="pt-40 pb-8 px-4 bg-muted/30 relative overflow-hidden"
        style={{ scrollMarginTop: "4rem" }}
      >
        {/* Background animation elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-data-primary rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-data-secondary rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto relative z-10">
          <InstantReveal>
            <div className="text-center mb-20">
              <Badge className="bg-data-secondary/10 text-data-secondary border-data-secondary/20 mb-6 px-4 py-2 text-xs font-medium uppercase tracking-wide">
                Effortless Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                From Raw Data to Compelling Story
                <span className="text-lg md:text-xl font-normal text-muted-foreground block mt-4">
                  in Just 3 Simple Steps
                </span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
                Experience the future of data storytelling. Our revolutionary
                AI platform transforms complex datasets into engaging visual
                narratives that
                <span className="font-medium text-foreground">
                  {" "}
                  inform, persuade, and inspire action.
                </span>
              </p>
            </div>
          </InstantReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <RevealOnScroll delay={0.1}>
              <ProcessStep
                step={1}
                icon={Database}
                title="Smart Data Upload"
                description="Simply drag & drop your files—CSV, Excel, or JSON. Our intelligent system instantly validates data quality, detects patterns, and prepares your dataset for analysis in seconds."
                color="bg-data-primary"
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <ProcessStep
                step={2}
                icon={Brain}
                title="AI-Powered Insights"
                description="Advanced machine learning algorithms dive deep into your data, uncovering hidden correlations, trending patterns, and actionable insights that would take hours to find manually."
                color="bg-data-secondary"
              />
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <ProcessStep
                step={3}
                icon={Eye}
                title="Stunning Visual Narratives"
                description="Transform insights into compelling stories with interactive dashboards, dynamic charts, and narrative flows that captivate your audience and drive decision-making."
                color="bg-data-accent"
              />
            </RevealOnScroll>
          </div>

          {/* Interactive Data Visualization Demo */}
          <RevealOnScroll delay={0.25}>
            <div className="max-w-4xl mx-auto mt-20">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-data-primary/10 to-data-accent/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-data-primary/20">
                  <div className="w-1.5 h-1.5 bg-data-primary rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-data-primary uppercase tracking-wide">
                    Live Demo
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                  Watch Your Data Come to Life
                </h3>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  See how our AI transforms raw numbers into beautiful,
                  interactive visualizations that tell compelling stories and
                  drive actionable insights.
                </p>
              </div>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-data-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-data-accent/10 rounded-full blur-2xl"></div>

                <ClientOnly
                  fallback={
                    <div className="w-full h-64 bg-gradient-to-br from-muted/40 to-muted/20 rounded-2xl p-8 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-data-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <BarChart3 className="w-6 h-6 text-data-primary" />
                        </div>
                        <div className="text-muted-foreground font-medium">
                          Loading interactive demo...
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
                    <DataVisualization />
                  </div>
                </ClientOnly>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </LightParallax>
  );
}

// Process Step Component
function ProcessStep({
  step,
  icon: Icon,
  title,
  description,
  color,
}: {
  step: number;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="text-center space-y-8 relative group hover:scale-105 transition-all duration-500 cursor-pointer">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm"></div>

      {/* Step Number with enhanced styling */}
      <div className="flex items-center justify-center relative z-10">
        <div className="relative">
          <div
            className={`${color} w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl relative shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
          >
            {step}
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse opacity-60"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>
        </div>
      </div>

      {/* Icon with enhanced styling */}
      <div className="flex items-center justify-center relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 border border-white/10">
          <Icon className="w-8 h-8 text-data-primary group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      <div className="space-y-3 relative z-10 px-4">
        <h3 className="text-xl font-semibold text-foreground group-hover:text-data-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
}
