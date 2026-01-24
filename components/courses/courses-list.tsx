"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchCourses, createCourse, updateCourse, deleteCourse } from "@/lib/courses-service"
import type { Course } from "@/lib/types"
import { Users, Clock, Calendar, MoreVertical, Pencil, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CourseDialog } from "./course-dialog"
import { DeleteCourseDialog } from "./delete-course-dialog"

export function CoursesList() {
  const { data: courses = [], isLoading, mutate } = useSWR("courses", fetchCourses)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCourse = () => {
    setSelectedCourse(null)
    setDialogOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setDialogOpen(true)
  }

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  const handleSaveCourse = async (courseData: {
    subject: string
    grade: number
    groupNumber: number
    schedule: string
    students: number
    color: string
    id?: string
  }) => {
    setIsSubmitting(true)
    try {
      if (courseData.id) {
        await updateCourse(courseData.id, courseData)
      } else {
        await createCourse(courseData)
      }
      await mutate() // Refresh data from Supabase
    } catch (error) {
      console.error("Error saving course:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedCourse) {
      setIsSubmitting(true)
      try {
        await deleteCourse(selectedCourse.id)
        await mutate() // Refresh data from Supabase
        setDeleteDialogOpen(false)
        setSelectedCourse(null)
      } catch (error) {
        console.error("Error deleting course:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando cursos...</div>
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          className="border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors flex items-center justify-center min-h-[200px]"
          onClick={handleAddCourse}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Plus className="h-8 w-8" />
            <span className="font-medium">Agregar Curso</span>
          </div>
        </Card>

        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className={cn("h-2", course.color)} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Grado {course.grade}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCourse(course)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.students} estudiantes
                </span>
              </div>
              {course.schedule && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {course.schedule}
                </div>
              )}
              <div className="flex gap-2">
                {/* <Link href={`/cursos/${course.id}/estudiantes`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1 bg-transparent">
                    <Users className="h-4 w-4" />
                    Estudiantes
                  </Button>
                </Link> */}
                <Link href={`/planeacion?curso=${course.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1 bg-transparent">
                    <Calendar className="h-4 w-4" />
                    Planeación
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CourseDialog open={dialogOpen} onOpenChange={setDialogOpen} course={selectedCourse} onSave={handleSaveCourse} />

      <DeleteCourseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        course={selectedCourse}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
