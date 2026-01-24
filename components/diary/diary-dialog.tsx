"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCourses } from "@/lib/store"
import type { DiaryEntry } from "@/lib/data"

interface DiaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: DiaryEntry | null
  onSave: (entry: Omit<DiaryEntry, "id"> | DiaryEntry) => void
}

export function DiaryDialog({ open, onOpenChange, entry, onSave }: DiaryDialogProps) {
  const { courses } = useCourses()
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    date: new Date().toISOString().split("T")[0],
    topic: "",
    activities: "",
    observations: "",
  })

  useEffect(() => {
    if (entry) {
      setFormData({
        courseId: entry.courseId,
        courseName: entry.courseName,
        date: entry.date,
        topic: entry.topic,
        activities: entry.activities,
        observations: entry.observations,
      })
    } else {
      setFormData({
        courseId: "",
        courseName: "",
        date: new Date().toISOString().split("T")[0],
        topic: "",
        activities: "",
        observations: "",
      })
    }
  }, [entry, open])

  const handleCourseChange = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    setFormData({
      ...formData,
      courseId,
      courseName: course ? `${course.name} ${course.grade}` : "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (entry) {
      onSave({ ...formData, id: entry.id })
    } else {
      onSave(formData)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{entry ? "Editar Registro" : "Nuevo Registro de Diario"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="course">Curso</Label>
                <Select value={formData.courseId} onValueChange={handleCourseChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} - {course.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Tema</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Tema de la clase"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activities">Actividades Realizadas</Label>
              <Textarea
                id="activities"
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                placeholder="Describe las actividades realizadas..."
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                placeholder="Observaciones de la clase..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{entry ? "Guardar Cambios" : "Crear Registro"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
