"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStudents } from "@/lib/store"
import type { Observation } from "@/lib/data"

interface ObservationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  observation?: Observation | null
  onSave: (observation: Omit<Observation, "id"> | Observation) => void
}

export function ObservationDialog({ open, onOpenChange, observation, onSave }: ObservationDialogProps) {
  const { students } = useStudents()
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    type: "academic" as "academic" | "behavioral",
    severity: "low" as "low" | "medium" | "high",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (observation) {
      setFormData({
        studentId: observation.studentId,
        studentName: observation.studentName,
        type: observation.type,
        severity: observation.severity,
        description: observation.description,
        date: observation.date,
      })
    } else {
      setFormData({
        studentId: "",
        studentName: "",
        type: "academic",
        severity: "low",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [observation, open])

  const handleStudentChange = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    setFormData({
      ...formData,
      studentId,
      studentName: student?.name || "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (observation) {
      onSave({ ...formData, id: observation.id })
    } else {
      onSave(formData)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{observation ? "Editar Observación" : "Nueva Observación"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Estudiante</Label>
              <Select value={formData.studentId} onValueChange={handleStudentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "academic" | "behavioral" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Académica</SelectItem>
                    <SelectItem value="behavioral">Comportamental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="severity">Gravedad</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value as "low" | "medium" | "high" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe la observación..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{observation ? "Guardar Cambios" : "Crear Observación"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
