"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import type { Student, GradeItem } from "@/lib/types"
import { emptyGrades } from "@/lib/types"
import { fetchStudents, updateStudent } from "@/lib/students-service"
import type { Course } from "@/lib/types"
import { fetchCourses } from "@/lib/courses-service"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"


type Period = "p1" | "p2" | "p3" | "p4"

/* =======================
   UTIL
======================= */
const average = (grades: GradeItem[] = []) => {
  if (!grades.length) return null
  const sum = grades.reduce((acc, g) => acc + g.value, 0)
  return Number((sum / grades.length).toFixed(2))
}

export function CalificacionesList() {

  const [selectedCourse, setSelectedCourse] = useState<string>("all")

  const { data: courses = [] } = useSWR<Course[]>(
    "courses",
    fetchCourses
  )


  const { data: students = [], mutate } = useSWR<Student[]>(
    "students",
    fetchStudents
  )

  const [open, setOpen] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const [period, setPeriod] = useState<Period>("p1")
  const [notes, setNotes] = useState<GradeItem[]>([])
  const [newValue, setNewValue] = useState("")
  const [newTitle, setNewTitle] = useState("")

  const filteredStudents =
    selectedCourse === "all"
      ? students
      : students.filter((s) => s.courseId === selectedCourse)



  const openDialog = (s: Student, p: Period) => {
  const grades = {
    ...emptyGrades,
    ...s.grades,
  }

  setStudent({ ...s, grades })
  setPeriod(p)
  setNotes(grades[p] ?? []) // 👈 SIEMPRE array
  setOpen(true)
}


  const addNote = () => {
    const value = Number(newValue)
    if (isNaN(value) || value < 1 || value > 5) return

    const note: GradeItem = {
      value,
      title: newTitle || undefined,
      createdAt: new Date().toISOString(),
    }

    setNotes([...notes, note])
    setNewValue("")
    setNewTitle("")
  }

  const removeNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index))
  }

  const saveNotes = async () => {
    if (!student) return

    await updateStudent(student.id, {
      grades: {
        ...student.grades,
        [period]: notes,
      },
    })

    mutate()
    setOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Calificaciones</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4 w-full sm:w-[300px]">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos los cursos</SelectItem>

                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <table className="w-full text-center">
            <thead>
              <tr className="border-b">
                <th className="text-left">Estudiante</th>
                <th>P1</th>
                <th>P2</th>
                <th>P3</th>
                <th>P4</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-3 text-left">{s.fullName}</td>

                  {(["p1", "p2", "p3", "p4"] as Period[]).map((p) => (
                    <td key={p}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(s, p)}
                      >
                        {average(s.grades?.[p]) ?? "—"}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Notas {period.toUpperCase()} – {student?.fullName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nota (1.0 - 5.0)"
                type="number"
                step="0.1"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <Input
                placeholder="Título (opcional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Button onClick={addNote}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {Array.isArray(notes) && notes.map((n, i) => (

              <div
                key={i}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <b>{n.value}</b>
                  {n.title && (
                    <p className="text-xs text-muted-foreground">
                      {n.title}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeNote(i)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}

            <p className="text-sm text-muted-foreground">
              Promedio: <b>{average(notes) ?? "—"}</b>
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNotes}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
