"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, BookOpen, MessageSquare, Bell, Calendar } from "lucide-react"

import type { Student, Course } from "@/lib/types"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Grades } from "@/lib/types"

interface StudentProfileData {
  id: string
  fullName: string
  active: boolean
  document: string
  gender: string
  age: number
  gradeAndCourse: string | null
  averageGrade: number | null
  grades: Grades
}

const getAverageColor = (avg: number) => {
  if (avg < 3.0) return "text-red-500"
  if (avg < 4.0) return "text-amber-500"
  if (avg < 4.8) return "text-blue-500"
  return "text-emerald-500"
}

const getAverageBg = (avg: number) => {
  if (avg < 3.0) return "bg-red-50 border-red-200"
  if (avg < 4.0) return "bg-amber-50 border-amber-200"
  if (avg < 4.8) return "bg-blue-50 border-blue-200"
  return "bg-emerald-50 border-emerald-200"
}

interface StudentProfileProps {
  studentId: string
}

export function StudentProfile({ studentId }: StudentProfileProps) {
  const [student, setStudent] = useState<StudentProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      setError(null)

      function calculateAge(birthDate: string): number {
        const birth = new Date(birthDate)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--
        }
        return age
      }

      const { data, error } = await supabase
        .from("students")
        .select(`
            id,
            first_name,
            last_name,
            gender,
            status,
            birth_date,
            document_type,
            document_number,
            grades,
            courses (
              subject,
              grade,
              group_number
            )
          `)
        .eq("id", studentId)
        .maybeSingle()

      if (error) {
        setError("No se pudo cargar el estudiante")
        setStudent(null)
      } else {
        if (error || !data) {
          console.error(error)
          setError("No se pudo cargar el estudiante")
          setStudent(null)
        } else {
          setStudent({
            id: data.id,
            fullName: `${data.first_name} ${data.last_name}`,
            active: data.status === "active",
            document: `${data.document_type} ${data.document_number}`,
            gender: data.gender,
            age: calculateAge(data.birth_date),
            gradeAndCourse: data.courses
              ? `${data.courses.subject}: ${data.courses.grade}°-${data.courses.group_number}`
              : null,
            averageGrade: null,
            grades: data.grades ?? {
              p1: [],
              p2: [],
              p3: [],
              p4: [],
            },
          })
        }
        if (error) {
          console.error("SUPABASE ERROR:", error)
        }
      }
      setLoading(false)
    }

    fetchStudent()
  }, [studentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse space-y-4 w-full max-w-3xl">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Estudiante no encontrado</p>
      </div>
    )
  }

  const allNotes = Object.values(student.grades || {})
    .flat()
    .filter((n) => typeof n?.value === "number")

  const generalAverage =
    allNotes.length > 0
      ? allNotes.reduce((acc, n) => acc + n.value, 0) / allNotes.length
      : null

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{student.fullName}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{student.gradeAndCourse ?? "Sin asignar"}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span>{student.age} años</span>
                  <Badge variant={student.active ? "default" : "secondary"} className="ml-2">
                    {student.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </div>

            {generalAverage !== null && (
              <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${getAverageBg(generalAverage)} min-w-[120px]`}>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Promedio</span>
                <span className={`text-3xl font-bold ${getAverageColor(generalAverage)}`}>
                  {generalAverage.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Card */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0 px-6 pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-lg">
              <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-background">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="notas" className="gap-2 data-[state=active]:bg-background">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Notas</span>
              </TabsTrigger>
              <TabsTrigger value="observaciones" className="gap-2 data-[state=active]:bg-background">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Observaciones</span>
              </TabsTrigger>
              <TabsTrigger value="llamados" className="gap-2 data-[state=active]:bg-background">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Llamados</span>
              </TabsTrigger>
              <TabsTrigger value="diario" className="gap-2 data-[state=active]:bg-background">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Diario</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6 px-6 pb-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Documento</p>
                  <p className="text-sm">{student.document}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Género</p>
                  <p className="text-sm capitalize">{student.gender}</p>
                </div>
              </div>

              <div className="h-px bg-border"></div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Evaluaciones</p>
                  <p className="text-2xl font-semibold">—</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Observaciones</p>
                  <p className="text-2xl font-semibold">—</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notas" className="mt-6 px-6 pb-6 space-y-6">
              {Object.entries(student.grades || {}).map(([period, notes]) => {
                if (!Array.isArray(notes) || notes.length === 0) return null

                const average = notes.reduce((acc, note) => acc + note.value, 0) / notes.length

                return (
                  <div key={period} className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <h3 className="text-sm font-semibold uppercase tracking-wider">{period}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getAverageBg(average)}`}>
                        <span className={getAverageColor(average)}>{average.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {notes.map((note, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                          <span className="text-sm font-medium">{note.title || "Sin título"}</span>
                          <span className={`text-sm font-semibold ${getAverageColor(note.value)}`}>
                            {note.value.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {Object.values(student.grades || {}).every(notes => !Array.isArray(notes) || notes.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No hay notas registradas</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="observaciones" className="mt-6 px-6 pb-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Próximamente: observaciones</p>
              </div>
            </TabsContent>

            <TabsContent value="llamados" className="mt-6 px-6 pb-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Próximamente: llamados de atención</p>
              </div>
            </TabsContent>

            <TabsContent value="diario" className="mt-6 px-6 pb-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Próximamente: diario pedagógico</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  )
}