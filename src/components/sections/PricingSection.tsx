// src/components/sections/PricingSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-24 px-4 bg-muted/30"
      style={{ scrollMarginTop: "4rem" }}
    >
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <Badge className="bg-data-primary/10 text-data-primary border-data-primary/20 mb-4">
            Simple Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            period="forever"
            description="Perfect for individuals getting started"
            features={[
              "5 datasets per month",
              "Basic AI insights",
              "Standard templates",
              "Community support",
            ]}
            buttonText="Start Free"
          />
          <PricingCard
            name="Pro"
            price="$29"
            period="month"
            description="Best for small teams and professionals"
            features={[
              "Unlimited datasets",
              "Advanced AI analysis",
              "Custom branding",
              "Priority support",
              "Export to all formats",
            ]}
            buttonText="Start Trial"
            popular
          />
          <PricingCard
            name="Enterprise"
            price="$99"
            period="month"
            description="For organizations with advanced needs"
            features={[
              "Everything in Pro",
              "SSO integration",
              "Advanced security",
              "Custom integrations",
              "Dedicated support",
            ]}
            buttonText="Contact Sales"
          />
        </div>
      </div>
    </section>
  );
}

// Pricing Card Component
function PricingCard({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  popular = false,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}) {
  return (
    <Card
      className={`relative ${
        popular ? "border-data-primary shadow-lg scale-105" : "border-border"
      } transition-all duration-300 hover:shadow-lg`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-data-primary text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center space-y-4 pb-6">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <div className="space-y-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground">/{period}</span>
          </div>
          <CardDescription className="text-base">{description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-data-success flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          className={`w-full ${
            popular ? "bg-data-primary hover:bg-data-primary/90" : ""
          }`}
          variant={popular ? "default" : "outline"}
          size="lg"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
