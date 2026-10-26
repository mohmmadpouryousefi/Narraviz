import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-chart-gradient flex flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/" className="flex items-center gap-3">
        <span className="w-9 h-9 bg-story-gradient rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" aria-hidden />
        </span>
        <span className="text-xl font-bold bg-story-gradient bg-clip-text text-transparent">Narraviz</span>
      </Link>
      {children}
    </div>
  );
}
