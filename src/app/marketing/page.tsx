// src/app/marketing/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  BarChart3, 
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  PlayCircle,
  Target,
  Rocket,
  Award,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-story-gradient rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-story-gradient bg-clip-text text-transparent">
                Narraviz
              </h1>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="bg-data-primary hover:bg-data-primary/90">
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 bg-chart-gradient">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-data-primary/10 text-data-primary border-data-primary/20 mb-6">
              <Target className="w-4 h-4 mr-2" />
              Marketing Intelligence
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold">
              Marketing that
              <span className="bg-story-gradient bg-clip-text text-transparent block mt-2">
                Tells a Story
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your marketing data into compelling narratives that drive engagement, 
              conversions, and business growth.
            </p>
            
            <div className="flex items-center gap-4 justify-center mt-8">
              <Link href="/dashboard">
                <Button size="lg" className="bg-data-primary hover:bg-data-primary/90 px-8 py-3">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Campaign Analysis
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3">
                <PlayCircle className="w-5 h-5 mr-2" />
                View Success Stories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Marketing Teams Choose Narraviz
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Turn complex campaign data into clear, actionable insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={TrendingUp}
              title="ROI Visualization"
              description="Clear visual stories showing campaign performance and return on investment."
              color="bg-data-primary"
            />
            <BenefitCard
              icon={Users}
              title="Audience Insights"
              description="Understand your customers through compelling demographic and behavioral stories."
              color="bg-data-secondary"
            />
            <BenefitCard
              icon={Award}
              title="Performance Reports"
              description="Automated reports that highlight wins and opportunities for optimization."
              color="bg-data-accent"
            />
            <BenefitCard
              icon={Lightbulb}
              title="Strategic Insights"
              description="AI-powered recommendations based on your data patterns and trends."
              color="bg-data-success"
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Perfect for Every Marketing Use Case
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From campaign analysis to customer journey mapping
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UseCaseCard
              title="Campaign Performance"
              description="Track multi-channel campaigns with unified reporting and clear ROI stories."
              metrics={["300% better reporting speed", "85% faster insights", "60% improved ROI tracking"]}
            />
            <UseCaseCard
              title="Customer Journey Analysis"
              description="Visualize customer touchpoints and optimize conversion funnels with data stories."
              metrics={["40% higher conversion rates", "25% better customer retention", "50% faster optimization"]}
            />
            <UseCaseCard
              title="Social Media Analytics"
              description="Transform social engagement data into compelling brand performance narratives."
              metrics={["5x more engaging reports", "90% faster social analysis", "200% better stakeholder buy-in"]}
            />
            <UseCaseCard
              title="Email Marketing Stories"
              description="Turn email metrics into visual stories that drive better campaign decisions."
              metrics={["45% higher open rates", "30% better click-through", "65% improved segmentation"]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-story-gradient border-0 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="p-16 text-center relative z-10">
              <h3 className="text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Marketing Data?
              </h3>
              <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
                Join marketing teams who are already creating compelling data stories that drive results.
              </p>
              <div className="flex items-center gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-data-primary hover:bg-white/90 px-8 py-3">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>No setup fees</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

// Benefit Card Component
function BenefitCard({ icon: Icon, title, description, color }: {
  icon: React.ElementType
  title: string
  description: string
  color: string
}) {
  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 text-center">
      <CardHeader className="space-y-4">
        <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardHeader>
    </Card>
  )
}

// Use Case Card Component
function UseCaseCard({ title, description, metrics }: {
  title: string
  description: string
  metrics: string[]
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl text-data-primary">{title}</CardTitle>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        
        <div className="space-y-2 pt-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3">
              <Star className="w-4 h-4 text-data-accent flex-shrink-0" />
              <span className="text-sm font-medium">{metric}</span>
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  )
}