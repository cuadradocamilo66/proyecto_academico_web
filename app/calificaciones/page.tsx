import { AppShell } from "@/components/layout/app-shell"
import { CalificacionesList } from "@/components/grades/grades-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download } from "lucide-react"

export default function CalificacionesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calificaciones</h1>
            <p className="text-muted-foreground">Gestiona las notas de tus estudiantes (escala 1-5)</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <CalificacionesList />
      </div>
    </AppShell>
  )
}
