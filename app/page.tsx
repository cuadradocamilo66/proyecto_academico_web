import { AppShell } from "@/components/layout/app-shell"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { CoursesOverview } from "@/components/dashboard/courses-overview"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Users, BookOpen, ClipboardList, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Buenos días, Prof. Camilo Cuadrado</h1>
          <p className="text-muted-foreground">Aquí está el resumen de tu actividad docente</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Estudiantes Activos"
            value={120}
            description="En 4 cursos"
            icon={Users}
            trend={{ value: 5, positive: true }}
          />
          <StatsCard title="Cursos Activos" value={4} description="Este periodo" icon={BookOpen} />
          <StatsCard
            title="Promedio General"
            value="3.9"
            description="Escala 1-5"
            icon={ClipboardList}
            trend={{ value: 8, positive: true }}
          />
          <StatsCard title="Alertas Activas" value={3} description="Requieren atención" icon={AlertTriangle} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CoursesOverview />
            <PerformanceChart />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <AlertsPanel />
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
