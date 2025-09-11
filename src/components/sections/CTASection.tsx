// src/components/sections/CTASection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Headphones } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <Card className="bg-story-gradient border-0 max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="p-16 text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Revolutionize Your Data Storytelling?
            </h3>
            <p className="text-white/90 text-base md:text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Join over 10,000+ data professionals, analysts, and executives
              who trust Narraviz to transform their raw data into compelling,
              actionable stories. Start your free trial today—no credit card
              required.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-data-primary hover:bg-white/90 px-8 py-3 text-lg"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Talk to Sales
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
