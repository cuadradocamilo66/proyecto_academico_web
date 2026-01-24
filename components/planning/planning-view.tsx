"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Edit, Copy, Trash2 } from "lucide-react"

const weeklyPlanning = [
  {
    id: "1",
    week: "Semana 3",
    dateRange: "13 - 17 Enero 2026",
    unit: "Unidad 1: Números y Operaciones",
    competence: "Resuelve problemas de cantidad",
    standard: "Comprende y utiliza fracciones en contextos reales",
    indicators: [
      "Identifica fracciones equivalentes",
      "Compara y ordena fracciones",
      "Suma y resta fracciones con igual denominador",
    ],
    activities: [
      { day: "Lunes", activity: "Introducción a fracciones equivalentes con material concreto" },
      { day: "Miércoles", activity: "Ejercicios prácticos de comparación de fracciones" },
      { day: "Viernes", activity: "Evaluación formativa y retroalimentación" },
    ],
    resources: ["Regletas de fracciones", "Guía de ejercicios", "Video explicativo"],
    status: "current",
  },
  {
    id: "2",
    week: "Semana 4",
    dateRange: "20 - 24 Enero 2026",
    unit: "Unidad 1: Números y Operaciones",
    competence: "Resuelve problemas de cantidad",
    standard: "Aplica operaciones con fracciones en problemas cotidianos",
    indicators: [
      "Suma fracciones con diferente denominador",
      "Resta fracciones con diferente denominador",
      "Resuelve problemas contextualizados",
    ],
    activities: [
      { day: "Lunes", activity: "Introducción a MCM y operaciones con fracciones" },
      { day: "Miércoles", activity: "Trabajo grupal con problemas de aplicación" },
      { day: "Viernes", activity: "Evaluación sumativa de la unidad" },
    ],
    resources: ["Calculadora de fracciones", "Banco de problemas", "Rúbrica de evaluación"],
    status: "upcoming",
  },
]

export function PlanningView() {
  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
          Semana anterior
        </Button>
        <span className="text-sm font-medium">Enero 2026</span>
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          Semana siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Planning Cards */}
      <div className="space-y-6">
        {weeklyPlanning.map((plan) => (
          <Card key={plan.id} className={plan.status === "current" ? "ring-2 ring-primary" : ""}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">{plan.week}</CardTitle>
                  {plan.status === "current" && <Badge className="bg-primary text-primary-foreground">Actual</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.dateRange}</p>
                <p className="text-sm font-medium mt-1">{plan.unit}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Competencias y Estándares */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Competencia</h4>
                    <p className="text-sm">{plan.competence}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Estándar</h4>
                    <p className="text-sm">{plan.standard}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Indicadores de Logro</h4>
                    <ul className="space-y-1">
                      {plan.indicators.map((indicator, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actividades y Recursos */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Actividades</h4>
                    <div className="space-y-2">
                      {plan.activities.map((act, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <span className="font-medium text-primary min-w-[80px]">{act.day}</span>
                          <span>{act.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Recursos</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.resources.map((resource, idx) => (
                        <Badge key={idx} variant="secondary">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
