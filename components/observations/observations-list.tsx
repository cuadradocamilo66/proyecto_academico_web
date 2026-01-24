"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useObservations, addObservation, updateObservation, deleteObservation } from "@/lib/store"
import { Edit, Trash2, AlertTriangle, BookOpen, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ObservationDialog } from "./observation-dialog"
import { DeleteObservationDialog } from "./delete-observation-dialog"
import type { Observation } from "@/lib/data"

export function ObservationsList() {
  const { observations, isLoading } = useObservations()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null)

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          badge: "bg-destructive/10 text-destructive border-destructive/30",
          icon: "text-destructive",
          border: "border-l-destructive",
        }
      case "medium":
        return {
          badge: "bg-warning/10 text-warning-foreground border-warning/30",
          icon: "text-warning",
          border: "border-l-warning",
        }
      default:
        return {
          badge: "bg-success/10 text-success border-success/30",
          icon: "text-success",
          border: "border-l-success",
        }
    }
  }

  const getTypeStyles = (type: string) => {
    return type === "academic"
      ? { badge: "bg-primary/10 text-primary", icon: BookOpen }
      : { badge: "bg-chart-4/10 text-chart-4", icon: AlertTriangle }
  }

  const handleAddObservation = () => {
    setSelectedObservation(null)
    setDialogOpen(true)
  }

  const handleEditObservation = (observation: Observation) => {
    setSelectedObservation(observation)
    setDialogOpen(true)
  }

  const handleDeleteObservation = (observation: Observation) => {
    setSelectedObservation(observation)
    setDeleteDialogOpen(true)
  }

  const handleSaveObservation = async (observationData: Omit<Observation, "id"> | Observation) => {
    if ("id" in observationData) {
      await updateObservation(observationData.id, observationData)
    } else {
      await addObservation(observationData)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedObservation) {
      await deleteObservation(selectedObservation.id)
      setDeleteDialogOpen(false)
      setSelectedObservation(null)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando observaciones...</div>
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Historial de Observaciones</CardTitle>
          <Button size="sm" className="gap-1" onClick={handleAddObservation}>
            <Plus className="h-4 w-4" />
            Nueva Observación
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {observations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay observaciones registradas</p>
          ) : (
            observations.map((obs) => {
              const severityStyles = getSeverityStyles(obs.severity)
              const typeStyles = getTypeStyles(obs.type)
              const TypeIcon = typeStyles.icon

              return (
                <div
                  key={obs.id}
                  className={cn(
                    "rounded-lg border border-l-4 bg-card p-4 transition-colors hover:bg-muted/30",
                    severityStyles.border,
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("rounded-full p-2", typeStyles.badge)}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/estudiantes/${obs.studentId}`} className="font-medium hover:underline">
                            {obs.studentName}
                          </Link>
                          <Badge variant="outline" className={typeStyles.badge}>
                            {obs.type === "academic" ? "Académica" : "Comportamental"}
                          </Badge>
                          <Badge variant="outline" className={severityStyles.badge}>
                            {obs.severity === "high" ? "Alta" : obs.severity === "medium" ? "Media" : "Baja"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{obs.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(obs.date).toLocaleDateString("es-CO", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditObservation(obs)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteObservation(obs)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <ObservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        observation={selectedObservation}
        onSave={handleSaveObservation}
      />

      <DeleteObservationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        observation={selectedObservation}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
