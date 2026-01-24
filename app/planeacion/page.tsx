import { AppShell } from "@/components/layout/app-shell"
import { PlanningView } from "@/components/planning/planning-view"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download } from "lucide-react"

export default function PlaneacionPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Planeación Académica</h1>
            <p className="text-muted-foreground">Organiza tu planeación curricular por semana, unidad o periodo</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Planeación
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select defaultValue="1">
            <SelectTrigger className="w-48 bg-transparent">
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Matemáticas 5°</SelectItem>
              <SelectItem value="2">Ciencias 5°</SelectItem>
              <SelectItem value="3">Español 6°</SelectItem>
              <SelectItem value="4">Historia 6°</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="week">
            <SelectTrigger className="w-40 bg-transparent">
              <SelectValue placeholder="Vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Por Semana</SelectItem>
              <SelectItem value="unit">Por Unidad</SelectItem>
              <SelectItem value="period">Por Periodo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <PlanningView />
      </div>
    </AppShell>
  )
}
