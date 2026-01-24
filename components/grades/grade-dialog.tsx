"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStudents, useCourses } from "@/lib/store"
import type { GradeEntry } from "@/lib/data"

interface GradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grade?: GradeEntry | null
  onSave: (grade: Omit<GradeEntry, "id"> | GradeEntry) => void
}

const periodOptions = ["1er Periodo", "2do Periodo", "3er Periodo", "4to Periodo"]

export function GradeDialog({ open, onOpenChange, grade, onSave }: GradeDialogProps) {
  const { students } = useStudents()
  const { courses } = useCourses()
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    subject: "",
    grade: 3.0,
    period: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (grade) {
      setFormData({
        studentId: grade.studentId,
        studentName: grade.studentName,
        subject: grade.subject,
        grade: grade.grade,
        period: grade.period,
        date: grade.date,
      })
    } else {
      setFormData({
        studentId: "",
        studentName: "",
        subject: "",
        grade: 3.0,
        period: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [grade, open])

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
    if (grade) {
      onSave({ ...formData, id: grade.id })
    } else {
      onSave(formData)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{grade ? "Editar Calificación" : "Nueva Calificación"}</DialogTitle>
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
            <div className="grid gap-2">
              <Label htmlFor="subject">Materia</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar materia" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.name}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Calificación (1.0 - 5.0)</Label>
              <Input
                id="grade"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">Periodo</Label>
              <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{grade ? "Guardar Cambios" : "Agregar Calificación"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
