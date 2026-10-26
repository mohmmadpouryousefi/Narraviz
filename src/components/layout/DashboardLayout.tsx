import Link from "next/link";
import { BarChart3, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logOut } from "@/app/auth/actions";
import { SidebarNav } from "./SidebarNav";

export interface DashboardUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

function initials(user: DashboardUser): string {
  const source = user.name?.trim() || user.email || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2)).toUpperCase();
}

export function DashboardLayout({ user, children }: { user: DashboardUser; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 shrink-0 border-r bg-card/50 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="w-8 h-8 bg-story-gradient rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" aria-hidden />
            </span>
            <span>
              <span className="block text-lg font-bold bg-story-gradient bg-clip-text text-transparent">Narraviz</span>
              <span className="block text-xs text-muted-foreground">AI Data Stories</span>
            </span>
          </Link>
        </div>

        <div className="p-4">
          <Button asChild className="w-full bg-data-primary hover:bg-data-primary/90" size="sm">
            <Link href="/dashboard/datasets">
              <Plus className="w-4 h-4 mr-2" aria-hidden />
              New story
            </Link>
          </Button>
        </div>

        <SidebarNav />

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              {user.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback className="bg-data-primary text-white text-xs">{initials(user)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || user.email}</p>
              {user.name && user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
            </div>
            <form action={logOut}>
              <Button type="submit" variant="ghost" size="sm" aria-label="Sign out" title="Sign out">
                <LogOut className="w-4 h-4" aria-hidden />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
