"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, Upload } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home, exact: true },
  { href: "/dashboard/stories", label: "Stories", icon: FileText },
  { href: "/dashboard/datasets", label: "Datasets", icon: Upload },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 space-y-1" aria-label="Main">
      {items.map(({ href, label, icon: Icon, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
              active ? "bg-data-primary/10 text-data-primary" : "text-foreground/80 hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
