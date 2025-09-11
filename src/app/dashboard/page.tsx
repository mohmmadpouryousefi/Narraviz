// src/app/dashboard/page.tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { DashboardHome } from "@/components/dashboard/DashboardHome"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  )
}