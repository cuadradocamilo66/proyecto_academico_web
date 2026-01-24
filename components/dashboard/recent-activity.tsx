import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { diaryEntries, observations } from "@/lib/data"
import { FileText, AlertTriangle } from "lucide-react"

export function RecentActivity() {
  const recentItems = [
    ...diaryEntries.slice(0, 2).map((entry) => ({
      id: entry.id,
      type: "diary" as const,
      title: entry.topic,
      subtitle: entry.courseName,
      date: entry.date,
    })),
    ...observations.slice(0, 2).map((obs) => ({
      id: obs.id,
      type: "observation" as const,
      title: obs.studentName,
      subtitle: obs.description.substring(0, 50) + "...",
      date: obs.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentItems.map((item) => (
          <div key={`${item.type}-${item.id}`} className="flex items-start gap-3">
            <div
              className={`rounded-full p-2 ${
                item.type === "diary" ? "bg-chart-2/10 text-chart-2" : "bg-chart-4/10 text-chart-4"
              }`}
            >
              {item.type === "diary" ? <FileText className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(item.date).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
