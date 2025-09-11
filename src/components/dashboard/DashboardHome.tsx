import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp,
  TrendingDown,
  FileText, 
  Upload, 
  Sparkles, 
  BarChart3,
  PlusCircle,
  ArrowRight,
  Clock,
  Eye
} from "lucide-react"

export function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-chart-gradient rounded-lg p-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground mb-4">
              Transform your data into compelling stories with AI assistance
            </p>
            <div className="flex gap-3">
              <Button className="bg-data-primary hover:bg-data-primary/90">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Story
              </Button>
              <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/10">
                <Upload className="w-4 h-4 mr-2" />
                Upload Data
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-story-gradient rounded-full opacity-20"></div>
          </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-white/5 to-transparent"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Stories"
          value="24"
          change="+12%"
          trend="up"
          icon={FileText}
          color="bg-data-primary"
        />
        <StatCard
          title="Datasets"
          value="8"
          change="+3"
          trend="up"
          icon={Upload}
          color="bg-data-secondary"
        />
        <StatCard
          title="AI Insights"
          value="156"
          change="+45"
          trend="up"
          icon={Sparkles}
          color="bg-data-accent"
        />
        <StatCard
          title="Views"
          value="2.4K"
          change="+18%"
          trend="up"
          icon={Eye}
          color="bg-data-success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stories */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Stories
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <StoryItem
                title="Q3 Sales Performance Analysis"
                description="Interactive dashboard showing quarterly growth trends"
                status="Published"
                statusColor="bg-data-success"
                views="324"
                lastModified="2 hours ago"
              />
              <StoryItem
                title="Customer Behavior Insights"
                description="Deep dive into user engagement patterns"
                status="Draft"
                statusColor="bg-data-warning"
                views="0"
                lastModified="1 day ago"
              />
              <StoryItem
                title="Market Research Summary"
                description="Comprehensive analysis of industry trends"
                status="In Review"
                statusColor="bg-data-accent"
                views="89"
                lastModified="3 days ago"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Get started with your data storytelling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ActionButton
                icon={Upload}
                title="Upload Dataset"
                description="CSV, JSON, or Excel files"
                color="border-data-primary text-data-primary"
              />
              <ActionButton
                icon={Sparkles}
                title="AI Story Generator"
                description="Let AI create your story"
                color="border-data-accent text-data-accent"
              />
              <ActionButton
                icon={BarChart3}
                title="Chart Builder"
                description="Create custom visualizations"
                color="border-data-secondary text-data-secondary"
              />
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="bg-gradient-to-br from-data-primary/5 to-data-accent/5 border-data-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-data-primary">
                <Sparkles className="w-5 h-5" />
                AI Assistant
              </CardTitle>
              <CardDescription>Intelligent insights for your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm">
                  💡 <strong>AI Suggestion:</strong> Your sales data shows a strong correlation 
                  with seasonal trends. Consider creating a time-series story.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={75} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground">75 of 100 credits</span>
              </div>
              <Button variant="outline" className="w-full border-data-primary text-data-primary hover:bg-data-primary/5">
                Get AI Insights
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ActivityItem
                action="Story published"
                item="Q3 Sales Analysis"
                time="2 hours ago"
                icon={FileText}
              />
              <ActivityItem
                action="Dataset uploaded"
                item="customer-data.csv"
                time="1 day ago"
                icon={Upload}
              />
              <ActivityItem
                action="AI insight generated"
                item="Trend Analysis"
                time="2 days ago"
                icon={Sparkles}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, change, trend, icon: Icon, color }: {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
  const trendColor = trend === 'up' ? 'text-data-success' : 'text-destructive'
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              <Badge variant="secondary" className={`text-xs flex items-center gap-1 ${trendColor}`}>
                <TrendIcon className="w-3 h-3" />
                {change}
              </Badge>
            </div>
          </div>
          <div className={`${color} p-3 rounded-lg shadow-sm`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Story Item Component
function StoryItem({ title, description, status, statusColor, views, lastModified }: {
  title: string
  description: string
  status: string
  statusColor: string
  views: string
  lastModified: string
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="w-12 h-12 bg-chart-gradient rounded-lg flex items-center justify-center">
        <BarChart3 className="w-6 h-6 text-data-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`${statusColor}/10 text-xs`} variant="secondary">
            {status}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {views}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastModified}
          </span>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

// Activity Item Component
function ActivityItem({ action, item, time, icon: Icon }: {
  action: string
  item: string
  time: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{action}</span> {item}
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

// Action Button Component
function ActionButton({ icon: Icon, title, description, color }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}) {
  return (
    <Button variant="outline" className={`w-full h-auto p-4 ${color} border-2 hover:bg-current/5 transition-colors`}>
      <div className="flex items-center gap-3 w-full">
        <Icon className="w-6 h-6" />
        <div className="text-left">
          <div className="font-medium">{title}</div>
          <div className="text-xs opacity-70">{description}</div>
        </div>
        <ArrowRight className="w-4 h-4 ml-auto" />
      </div>
    </Button>
  )
}