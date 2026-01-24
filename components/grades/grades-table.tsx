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
import { Plus, Trash2, Filter, BookOpen, TrendingUp, TrendingDown, Minus, FileDown, FileSpreadsheet, FileText } from "lucide-react"
import { exportToExcel, exportToPDF } from "@/lib/export-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { Student, GradeItem } from "@/lib/types"
import { emptyGrades } from "@/lib/types"
import { fetchStudents, updateStudent } from "@/lib/students-service"
import type { Course } from "@/lib/types"
import { fetchCourses } from "@/lib/courses-service"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Period = "p1" | "p2" | "p3" | "p4"

/* =======================
   UTILS
======================= */
const average = (grades: GradeItem[] = []) => {
  if (!grades.length) return null
  const sum = grades.reduce((acc, g) => acc + g.value, 0)
  return Number((sum / grades.length).toFixed(2))
}

const getGradeColor = (avg: number | null) => {
  if (avg === null) return "text-muted-foreground"
  if (avg < 3.0) return "text-red-500"
  if (avg < 4.0) return "text-amber-500"
  if (avg < 4.8) return "text-blue-500"
  return "text-emerald-500"
}

const getGradeBg = (avg: number | null) => {
  if (avg === null) return "bg-muted/50 hover:bg-muted"
  if (avg < 3.0) return "bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 border-red-200"
  if (avg < 4.0) return "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 border-amber-200"
  if (avg < 4.8) return "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 border-blue-200"
  return "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 border-emerald-200"
}

const getPeriodLabel = (period: Period) => {
  const labels = {
    p1: "Periodo 1",
    p2: "Periodo 2",
    p3: "Periodo 3",
    p4: "Periodo 4"
  }
  return labels[period]
}

export function CalificacionesList() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const { data: courses = [] } = useSWR<Course[]>("courses", fetchCourses)
  const { data: students = [], mutate } = useSWR<Student[]>("students", fetchStudents)

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

  const selectedCourseName = selectedCourse === "all" 
    ? undefined 
    : courses.find(c => c.id === selectedCourse)?.name

  const handleExportExcel = () => {
    exportToExcel(filteredStudents, selectedCourseName)
  }

  const handleExportPDF = () => {
    exportToPDF(filteredStudents, selectedCourseName)
  }

  const openDialog = (s: Student, p: Period) => {
    const grades = {
      ...emptyGrades,
      ...s.grades,
    }

    setStudent({ ...s, grades })
    setPeriod(p)
    setNotes(grades[p] ?? [])
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

  const currentAverage = average(notes)

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Calificaciones</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-full sm:w-[280px]">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="h-10">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Filtrar por curso" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="font-medium">Todos los cursos</span>
                    </SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                    <span>Exportar a Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4 text-red-600" />
                    <span>Exportar a PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-6 font-semibold text-sm">Estudiante</th>
                  <th className="py-3 px-4 font-semibold text-sm text-center min-w-[100px]">P1</th>
                  <th className="py-3 px-4 font-semibold text-sm text-center min-w-[100px]">P2</th>
                  <th className="py-3 px-4 font-semibold text-sm text-center min-w-[100px]">P3</th>
                  <th className="py-3 px-4 font-semibold text-sm text-center min-w-[100px]">P4</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr 
                    key={s.id} 
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {s.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{s.fullName}</span>
                      </div>
                    </td>

                    {(["p1", "p2", "p3", "p4"] as Period[]).map((p) => {
                      const avg = average(s.grades?.[p])
                      return (
                        <td key={p} className="py-4 px-4">
                          <button
                            onClick={() => openDialog(s, p)}
                            className={`w-full min-w-[80px] px-4 py-2.5 rounded-lg border font-semibold text-sm transition-all ${getGradeBg(avg)}`}
                          >
                            <span className={getGradeColor(avg)}>
                              {avg !== null ? avg.toFixed(1) : "—"}
                            </span>
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-base font-medium text-muted-foreground">No hay estudiantes en este curso</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Selecciona otro curso o agrega estudiantes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* MODAL MEJORADO */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-2xl">{getPeriodLabel(period)}</DialogTitle>
                <p className="text-base font-medium text-muted-foreground">{student?.fullName}</p>
              </div>
              {currentAverage !== null && (
                <div className={`px-4 py-2 rounded-xl border-2 ${getGradeBg(currentAverage)}`}>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Promedio</p>
                  <p className={`text-2xl font-bold ${getGradeColor(currentAverage)}`}>
                    {currentAverage.toFixed(1)}
                  </p>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Input para agregar nota */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Agregar nueva nota</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Nota (1.0 - 5.0)"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-32"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addNote()
                  }}
                />
                <Input
                  placeholder="Título o descripción"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addNote()
                  }}
                />
                <Button onClick={addNote} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lista de notas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Notas registradas</p>
                <Badge variant="secondary" className="text-xs">
                  {notes.length} nota{notes.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
                  <Minus className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No hay notas registradas</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Agrega una nota usando el formulario</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {notes.map((n, i) => (
                    <div
                      key={i}
                      className={`group flex items-center justify-between gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-sm ${getGradeBg(n.value)}`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`text-2xl font-bold ${getGradeColor(n.value)} shrink-0`}>
                          {n.value.toFixed(1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          {n.title && (
                            <p className="text-sm font-medium truncate">{n.title}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(n.createdAt).toLocaleDateString('es-CO', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNote(i)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNotes} className="gap-2">
              <BookOpen className="h-4 w-4" />
              Guardar notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}