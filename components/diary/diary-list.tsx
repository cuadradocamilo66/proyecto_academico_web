"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDiaryEntries, addDiaryEntry, updateDiaryEntry, deleteDiaryEntry } from "@/lib/store"
import { Edit, Trash2, BookOpen, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { DiaryDialog } from "./diary-dialog"
import { DeleteDiaryDialog } from "./delete-diary-dialog"
import type { DiaryEntry } from "@/lib/data"

export function DiaryList() {
  const { diaryEntries, isLoading } = useDiaryEntries()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)

  const getCourseColor = (courseId: string) => {
    const colors: Record<string, string> = {
      "1": "bg-chart-1",
      "2": "bg-chart-2",
      "3": "bg-chart-3",
      "4": "bg-chart-4",
    }
    return colors[courseId] || "bg-muted"
  }

  const handleAddEntry = () => {
    setSelectedEntry(null)
    setDialogOpen(true)
  }

  const handleEditEntry = (entry: DiaryEntry) => {
    setSelectedEntry(entry)
    setDialogOpen(true)
  }

  const handleDeleteEntry = (entry: DiaryEntry) => {
    setSelectedEntry(entry)
    setDeleteDialogOpen(true)
  }

  const handleSaveEntry = async (entryData: Omit<DiaryEntry, "id"> | DiaryEntry) => {
    if ("id" in entryData) {
      await updateDiaryEntry(entryData.id, entryData)
    } else {
      await addDiaryEntry(entryData)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedEntry) {
      await deleteDiaryEntry(selectedEntry.id)
      setDeleteDialogOpen(false)
      setSelectedEntry(null)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando registros...</div>
  }

  return (
    <>
      <div className="space-y-4">
        {diaryEntries.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No hay registros en el diario</p>
            </CardContent>
          </Card>
        ) : (
          diaryEntries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <div className={cn("h-1", getCourseColor(entry.courseId))} />
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center text-center min-w-[60px]">
                      <span className="text-2xl font-bold text-primary">
                        {new Date(entry.date).getDate().toString().padStart(2, "0")}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {new Date(entry.date).toLocaleDateString("es-CO", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="gap-1">
                          <BookOpen className="h-3 w-3" />
                          {entry.courseName}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{entry.topic}</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Actividades: </span>
                          <span>{entry.activities}</span>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Observaciones: </span>
                          <span>{entry.observations}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditEntry(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteEntry(entry)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Floating Action Button for new entry */}
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          aria-label="Nuevo registro"
          onClick={handleAddEntry}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <DiaryDialog open={dialogOpen} onOpenChange={setDialogOpen} entry={selectedEntry} onSave={handleSaveEntry} />

      <DeleteDiaryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        entry={selectedEntry}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
