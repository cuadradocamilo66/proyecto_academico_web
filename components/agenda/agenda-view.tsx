"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

const events = [
  { date: 13, title: "Entrega de notas", type: "deadline", color: "bg-destructive" },
  { date: 15, title: "Reunión de padres", type: "meeting", color: "bg-chart-2" },
  { date: 17, title: "Evaluación Mat 5°", type: "exam", color: "bg-primary" },
  { date: 20, title: "Inicio Unidad 2", type: "planning", color: "bg-chart-3" },
  { date: 24, title: "Jornada pedagógica", type: "meeting", color: "bg-chart-2" },
]

// Generate calendar days for January 2026
const generateCalendarDays = () => {
  const firstDayOfMonth = new Date(2026, 0, 1).getDay() // 0 = Sunday
  const daysInMonth = 31
  const calendarDays: (number | null)[] = []

  // Add empty cells for days before the 1st
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  return calendarDays
}

export function AgendaView() {
  const calendarDays = generateCalendarDays()
  const today = 14 // Simulating today as January 14

  const getEventsForDay = (day: number) => {
    return events.filter((e) => e.date === day)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar Grid */}
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : []
              const isToday = day === today

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[80px] rounded-lg border p-2 transition-colors",
                    day ? "hover:bg-muted/50 cursor-pointer" : "bg-muted/20",
                    isToday && "ring-2 ring-primary bg-primary/5",
                  )}
                >
                  {day && (
                    <>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isToday && "text-primary",
                          day < today && "text-muted-foreground",
                        )}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((event, eventIdx) => (
                          <div key={eventIdx} className={cn("h-1.5 rounded-full", event.color)} title={event.title} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Próximos Eventos</h3>
          <div className="space-y-4">
            {events
              .filter((e) => e.date >= today)
              .sort((a, b) => a.date - b.date)
              .map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center min-w-[40px]">
                    <span className="text-lg font-bold text-primary">{event.date}</span>
                    <span className="text-xs text-muted-foreground">Ene</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <Badge variant="secondary" className={cn("mt-1 text-xs", event.color.replace("bg-", "text-"))}>
                      {event.type === "deadline"
                        ? "Fecha límite"
                        : event.type === "meeting"
                          ? "Reunión"
                          : event.type === "exam"
                            ? "Evaluación"
                            : "Planeación"}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
