import { AppShell } from "@/components/layout/app-shell"
import { StudentsList } from "@/components/students/students-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"

export default function EstudiantesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Estudiantes</h1>
            <p className="text-muted-foreground">Gestiona y haz seguimiento a tus estudiantes</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Estudiante
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar estudiante por nombre..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <StudentsList />
      </div>
    </AppShell>
  )
}
