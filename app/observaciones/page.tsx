import { AppShell } from "@/components/layout/app-shell"
import { ObservationsList } from "@/components/observations/observations-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react"

export default function ObservacionesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Observaciones y Llamados</h1>
            <p className="text-muted-foreground">Registro de observaciones académicas y comportamentales</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Observación
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por estudiante..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-transparent">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="academic">Académica</SelectItem>
              <SelectItem value="behavioral">Comportamental</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-transparent">
              <SelectValue placeholder="Gravedad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Más filtros
          </Button>
        </div>

        <ObservationsList />
      </div>
    </AppShell>
  )
}
