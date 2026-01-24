"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { students } from "@/lib/data"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, Users, AlertTriangle, Award } from "lucide-react"

const gradeDistribution = [
  { name: "Excelente (4.5-5.0)", value: 8, color: "var(--color-success)" },
  { name: "Bueno (3.5-4.4)", value: 12, color: "var(--color-chart-2)" },
  { name: "Aceptable (3.0-3.4)", value: 5, color: "var(--color-warning)" },
  { name: "Bajo (1.0-2.9)", value: 3, color: "var(--color-destructive)" },
]

const performanceTrend = [
  { week: "S1", promedio: 3.6 },
  { week: "S2", promedio: 3.7 },
  { week: "S3", promedio: 3.9 },
  { week: "S4", promedio: 3.8 },
  { week: "S5", promedio: 4.0 },
]

const subjectComparison = [
  { subject: "Mat", promedio: 3.8 },
  { subject: "Cien", promedio: 4.2 },
  { subject: "Esp", promedio: 3.5 },
  { subject: "Hist", promedio: 4.0 },
]

export function ReportsView() {
  const topStudents = [...students].sort((a, b) => b.averageGrade - a.averageGrade).slice(0, 3)
  const needsSupport = students.filter((s) => s.averageGrade < 3.0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">Total Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-success/10 p-3">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">3.9</p>
                <p className="text-sm text-muted-foreground">Promedio General</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-warning/10 p-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{needsSupport.length}</p>
                <p className="text-sm text-muted-foreground">Requieren Apoyo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-chart-2/10 p-3">
                <Award className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Rendimiento Excelente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Distribución de Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={gradeDistribution} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {gradeDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tendencia de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={performanceTrend}>
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[3, 5]} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-card p-2 shadow-sm">
                          <p className="text-sm font-medium">Semana {payload[0].payload.week}</p>
                          <p className="text-xs text-muted-foreground">Promedio: {payload[0].value}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="promedio"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Comparison and Top Students */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Comparación por Asignatura</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectComparison} layout="vertical">
                <XAxis type="number" domain={[0, 5]} tickLine={false} axisLine={false} fontSize={12} />
                <YAxis type="category" dataKey="subject" tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-card p-2 shadow-sm">
                          <p className="text-sm font-medium">{payload[0].payload.subject}</p>
                          <p className="text-xs text-muted-foreground">Promedio: {payload[0].value}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="promedio" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Mejores Promedios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topStudents.map((student, idx) => (
              <div key={student.id} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/20 text-sm font-bold text-chart-2">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.grade}</p>
                </div>
                <span className="text-lg font-bold text-success">{student.averageGrade.toFixed(1)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Students Needing Support */}
      {needsSupport.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Estudiantes que Requieren Apoyo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {needsSupport.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-sm font-medium text-destructive">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Promedio: {student.averageGrade.toFixed(1)}</p>
                  </div>
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
