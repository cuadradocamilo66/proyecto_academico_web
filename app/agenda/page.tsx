import { AppShell } from "@/components/layout/app-shell"
import { AgendaView } from "@/components/agenda/agenda-view"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"

export default function AgendaPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground">Organiza tus actividades y eventos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <h2 className="text-lg font-semibold">Enero 2026</h2>
          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <AgendaView />
      </div>
    </AppShell>
  )
}
