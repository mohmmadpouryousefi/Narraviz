// src/components/sections/FeaturesSection.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Sparkles,
  Zap,
  Palette,
  Share2,
  ShieldCheck,
} from "lucide-react";
import {
  RevealOnScroll,
} from "@/components/animations/GSAPAnimations";
import { ClientOnly } from "@/components/ClientOnly";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="pt-16 px-4 relative"
      style={{ scrollMarginTop: "4rem" }}
    >
      {/* Animated background pattern */}
      <ClientOnly>
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 grid-rows-8 gap-4 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="bg-data-primary rounded animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </ClientOnly>

      <div className="container mx-auto relative z-10">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <Badge className="bg-data-accent/10 text-data-accent border-data-accent/20 mb-4 px-4 py-2 text-xs font-medium uppercase tracking-wide">
              Enterprise-Grade Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Everything You Need for
              <span className="block bg-gradient-to-r from-data-primary via-data-accent to-data-secondary bg-clip-text text-transparent">
                Professional Data Storytelling
              </span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
                Built for data professionals who demand excellence. Advanced
                AI capabilities, enterprise security, and stunning
                visualizations—all in one powerful platform.
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-data-primary rounded-full animate-pulse"></div>
                  <span className="font-medium">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 bg-data-secondary rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <span className="font-medium">Enterprise-Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 bg-data-accent rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <span className="font-medium">Cloud-Native</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RevealOnScroll delay={0.05}>
            <FeatureCard
              icon={Sparkles}
              title="Intelligent Story Generation"
              description="Upload your data and watch our AI craft compelling narratives with contextual insights, trend analysis, and actionable recommendations automatically."
              color="bg-data-primary"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <FeatureCard
              icon={BarChart3}
              title="Adaptive Smart Visualizations"
              description="Our AI engine analyzes your data structure and automatically selects the most effective chart types, color schemes, and layouts for maximum impact."
              color="bg-data-secondary"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <FeatureCard
              icon={Zap}
              title="One-Click Publishing"
              description="Transform your analysis into polished, interactive presentations ready to share with stakeholders in seconds, not hours."
              color="bg-data-accent"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <FeatureCard
              icon={Palette}
              title="White-Label Branding"
              description="Seamlessly integrate your brand identity with custom colors, fonts, logos, and styling to maintain professional consistency across all deliverables."
              color="bg-data-success"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.25}>
            <FeatureCard
              icon={Share2}
              title="Multi-Format Export"
              description="Share your stories anywhere—export to PDF, PowerPoint, embed interactive widgets in websites, or generate secure sharing links with access controls."
              color="bg-data-warning"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <FeatureCard
              icon={ShieldCheck}
              title="Bank-Grade Security"
              description="SOC 2 Type II certified with end-to-end encryption, SSO integration, and advanced compliance features trusted by Fortune 500 companies."
              color="bg-data-primary"
            />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className="border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-lg hover:shadow-2xl hover:shadow-data-primary/10 transition-all duration-500 group relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-data-primary/5 via-transparent to-data-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-data-primary/20 via-data-secondary/20 to-data-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

      <CardHeader className="space-y-6 p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div
            className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative`}
          >
            <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-all duration-300"></div>
          </div>
          <div className="w-2 h-2 bg-data-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-ping"></div>
        </div>
        <div className="space-y-3">
          <CardTitle className="text-lg font-semibold group-hover:text-data-primary transition-colors duration-300 leading-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
            {description}
          </CardDescription>
        </div>

        {/* Subtle arrow indicator */}
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <ArrowRight className="w-5 h-5 text-data-primary" />
        </div>
      </CardHeader>
    </Card>
  );
}
