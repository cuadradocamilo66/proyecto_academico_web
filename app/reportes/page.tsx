import { AppShell } from "@/components/layout/app-shell"
import { ReportsView } from "@/components/reports/reports-view"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"

export default function ReportesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
            <p className="text-muted-foreground">Genera reportes académicos y comportamentales</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select defaultValue="course">
            <SelectTrigger className="w-40 bg-transparent">
              <SelectValue placeholder="Tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Por Estudiante</SelectItem>
              <SelectItem value="course">Por Curso</SelectItem>
              <SelectItem value="period">Por Periodo</SelectItem>
            </SelectContent>
          </Select>
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
          <Select defaultValue="1">
            <SelectTrigger className="w-40 bg-transparent">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1er Periodo</SelectItem>
              <SelectItem value="2">2do Periodo</SelectItem>
              <SelectItem value="3">3er Periodo</SelectItem>
              <SelectItem value="4">4to Periodo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ReportsView />
      </div>
    </AppShell>
  )
}
