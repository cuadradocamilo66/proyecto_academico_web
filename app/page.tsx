import { AppShell } from "@/components/layout/app-shell"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { CoursesOverview } from "@/components/dashboard/courses-overview"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Users, BookOpen, ClipboardList, AlertTriangle } from "lucide-react"
import { DashboardView } from "@/components/dashboard/dashboard-view"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
       
        <DashboardView />
       </div>
    </AppShell>
  )
}
