// src/components/sections/PricingSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  CheckCircle, 
  X, 
  Info, 
  Star, 
  Shield, 
  Zap, 
  Users,
  Globe,
  Award,
  Crown
} from "lucide-react";

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const pricingPlans = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for individuals getting started",
      features: [
        { text: "3 stories per month", included: true },
        { text: "Basic templates", included: true },
        { text: "Public sharing only", included: true },
        { text: "Community support", included: true },
        { text: "Advanced AI insights", included: false, tooltip: "Available in Pro plan" },
        { text: "Custom branding", included: false, tooltip: "Available in Pro plan" },
        { text: "Private sharing", included: false, tooltip: "Available in Pro plan" },
        { text: "Priority support", included: false, tooltip: "Available in Pro and Enterprise plans" },
      ],
      buttonText: "Start Free",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: 19,
      yearlyPrice: 15,
      description: "Best for professionals and small teams",
      features: [
        { text: "Unlimited stories", included: true },
        { text: "AI-powered insights", included: true, tooltip: "Advanced data analysis and recommendations" },
        { text: "Private sharing + passwords", included: true },
        { text: "Priority support", included: true },
        { text: "Custom branding", included: true, tooltip: "Add your logo and colors" },
        { text: "Advanced templates", included: true },
        { text: "Export to all formats", included: true },
        { text: "Team collaboration", included: false, tooltip: "Available in Enterprise plan" },
      ],
      buttonText: "Start 14-day Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: 49,
      yearlyPrice: 39,
      description: "For teams and organizations",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Real-time collaboration", included: true },
        { text: "Advanced analytics", included: true },
        { text: "SSO integration", included: true, tooltip: "Single Sign-On with SAML/OAuth" },
        { text: "Custom integrations", included: true },
        { text: "Dedicated support", included: true },
        { text: "White-label solution", included: true },
        { text: "API access", included: true },
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <TooltipProvider>
      <section
        id="pricing"
        className="py-24 px-4 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
        style={{ scrollMarginTop: "4rem" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="bg-data-primary/10 text-data-primary border-data-primary/20 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Simple, Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start free, upgrade when you need more power. No hidden fees, cancel anytime.
            </p>

            {/* Enhanced Billing Toggle */}
           {/*  <BillingToggle billing={billing} setBilling={setBilling} /> */}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                billing={billing}
                index={index}
              />
            ))}
          </div>

          {/* Trust Badges & Testimonials */}
          <TrustSection />
        </div>
      </section>
    </TooltipProvider>
  );
}

// Enhanced Pricing Card Component
function PricingCard({
  plan,
  billing,
  index,
}: {
  plan: {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    features: Array<{
      text: string;
      included: boolean;
      tooltip?: string;
    }>;
    buttonText: string;
    buttonVariant: "default" | "outline";
    popular: boolean;
  };
  billing: "monthly" | "yearly";
  index: number;
}) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const period = billing === "monthly" ? "month" : "month";
  const yearlyDiscount = billing === "yearly" && plan.monthlyPrice > 0;

  return (
    <Card
      ref={plan.popular ? (el) => { if (el) animatePopularCard(el); } : undefined}
      className={`relative ${
        plan.popular 
          ? "border-data-primary shadow-xl scale-105 bg-gradient-to-b from-background to-muted/20" 
          : "border-border hover:border-data-primary/50"
      } transition-all duration-500 hover:shadow-xl group`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {plan.popular && (
        <>
          <PopularBadge />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-lg pointer-events-none" />
        </>
      )}

      <CardHeader className="text-center space-y-6 pb-8 relative">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {plan.description}
          </CardDescription>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold tracking-tight">
              ${price}
            </span>
            <span className="text-muted-foreground font-medium">
              /{period}
            </span>
          </div>
          
          {yearlyDiscount && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                ${plan.monthlyPrice}/month
              </span>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Save 20%
              </Badge>
            </div>
          )}

          {billing === "yearly" && plan.monthlyPrice > 0 && (
            <p className="text-sm text-muted-foreground">
              Billed annually (${price * 12})
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          {plan.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-start gap-3 group/feature">
              {feature.included ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex items-center gap-2 flex-1">
                <span 
                  className={`text-sm ${
                    feature.included 
                      ? "text-foreground" 
                      : "text-muted-foreground line-through"
                  }`}
                >
                  {feature.text}
                </span>
                {feature.tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">{feature.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          className={`w-full h-12 font-semibold ${
            plan.popular 
              ? "bg-gradient-to-r from-data-primary to-blue-600 hover:from-data-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl" 
              : ""
          }`}
          variant={plan.buttonVariant}
          size="lg"
        >
          {plan.buttonText}
          {plan.name === "Pro" && <Zap className="w-4 h-4 ml-2" />}
          {plan.name === "Enterprise" && <Shield className="w-4 h-4 ml-2" />}
        </Button>

        {plan.name === "Free" && (
          <p className="text-xs text-center text-muted-foreground">
            No credit card required
          </p>
        )}

        {plan.name === "Pro" && (
          <p className="text-xs text-center text-muted-foreground">
            14-day free trial • Cancel anytime
          </p>
        )}

        {plan.name === "Enterprise" && (
          <p className="text-xs text-center text-muted-foreground">
            Custom pricing available
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Trust Section with Testimonials
function TrustSection() {
  const trustBadges = [
    { icon: Shield, text: "SOC 2 Compliant" },
    { icon: Globe, text: "99.9% Uptime" },
    { icon: Users, text: "10,000+ Users" },
    { icon: Award, text: "G2 Leader 2024" },
  ];

  const testimonials = [
    {
      quote: "Narraviz transformed how we present data to stakeholders. The AI insights are incredible!",
      author: "Sarah Chen",
      role: "Data Director",
      company: "TechCorp"
    },
    {
      quote: "Cut our reporting time by 70%. The automated storytelling feature is a game-changer.",
      author: "Michael Rodriguez", 
      role: "Analytics Manager",
      company: "StartupXYZ"
    },
    {
      quote: "Finally, a tool that makes data accessible to everyone in our organization.",
      author: "Emily Watson",
      role: "VP of Operations", 
      company: "Enterprise Inc"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Trust Badges */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-6">
          Trusted by data teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <badge.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-sm text-muted-foreground mb-4">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="text-sm">
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-muted-foreground">
                {testimonial.role} at {testimonial.company}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// GSAP Animation Function
function animatePopularCard(element: HTMLElement) {
  gsap.set(element, {
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)"
  });
  
  gsap.to(element, {
    boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.1)",
    duration: 2,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
  });
}

// Enhanced Billing Toggle Component


// Enhanced Popular Badge Component
function PopularBadge() {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (badgeRef.current) {
      // Floating animation
      gsap.to(badgeRef.current, {
        y: -2,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });

      // Subtle glow animation
      gsap.to(badgeRef.current, {
        filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))",
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });
    }
  }, []);

  return (
    <div 
      ref={badgeRef}
      className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-sm opacity-60" />
        
        {/* Main Badge */}
        <Badge className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 text-sm font-bold shadow-2xl border-0 rounded-full">
          <Crown className="w-4 h-4 mr-2 text-yellow-300" />
          <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-extrabold">
            Most Popular
          </span>
        </Badge>

        {/* Sparkle Effects */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-300" />
      </div>
    </div>
  );
}
