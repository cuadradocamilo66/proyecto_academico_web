import { Suspense } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { DiaryList } from "@/components/diary/diary-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, CalendarDays } from "lucide-react"

function DiaryContent() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Diario de Campo</h1>
            <p className="text-muted-foreground">Registro cronológico de actividades y observaciones de clase</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Registro
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por tema o actividad..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48 bg-transparent">
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              <SelectItem value="1">Matemáticas 5°</SelectItem>
              <SelectItem value="2">Ciencias 5°</SelectItem>
              <SelectItem value="3">Español 6°</SelectItem>
              <SelectItem value="4">Historia 6°</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <CalendarDays className="h-4 w-4" />
            Filtrar por fecha
          </Button>
        </div>

        <DiaryList />
      </div>
    </AppShell>
  )
}

export default function DiarioPage() {
  return (
    <Suspense fallback={null}>
      <DiaryContent />
    </Suspense>
  )
}
