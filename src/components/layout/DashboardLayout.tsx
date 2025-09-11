// src/components/layout/DashboardLayout.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart3,
  Upload,
  FileText,
  Sparkles,
  Home,
  Settings,
  HelpCircle,
  Plus,
  Search,
} from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-story-gradient rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-story-gradient bg-clip-text text-transparent">
                Narraviz
              </h1>
              <p className="text-xs text-muted-foreground">AI Data Stories</p>
            </div>
          </div>
        </div>

        {/* Quick Create */}
        <div className="p-4">
          <Button className="w-full bg-data-primary hover:bg-data-primary/90" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Story
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={Home} label="Dashboard" active />
          <NavItem icon={FileText} label="Stories" count={12} />
          <NavItem icon={Upload} label="Datasets" count={5} />
          <NavItem icon={BarChart3} label="Analytics" />
          
          <Separator className="my-4" />
          
          <div className="text-xs font-medium text-muted-foreground mb-2 px-3">
            AI ASSISTANT
          </div>
          <NavItem icon={Sparkles} label="AI Insights" badge="New" />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-data-primary text-white text-xs">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="border-b bg-card/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Dashboard</h2>
                <Badge variant="outline" className="text-data-success border-data-success/20">
                  ✓ All Systems Online
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Badge className="bg-data-warning/10 text-data-warning border-data-warning/20">
                  3 Credits Left
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ 
  icon: Icon, 
  label, 
  active = false, 
  count, 
  badge 
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  count?: number
  badge?: string
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full justify-start h-9 px-3 ${
        active ? 'bg-data-primary/10 text-data-primary border-data-primary/20' : ''
      }`}
    >
      <Icon className="w-4 h-4 mr-3" />
      <span className="flex-1 text-left">{label}</span>
      {count && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {count}
        </Badge>
      )}
      {badge && (
        <Badge className="ml-auto text-xs bg-data-accent/10 text-data-accent">
          {badge}
        </Badge>
      )}
    </Button>
  )
}
