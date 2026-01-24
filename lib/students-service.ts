import { supabase } from "@/lib/supabase/client"
import type { StudentDB, Student, Grades } from "@/lib/types"
import { dbStudentToFrontend, formatCourseName } from "@/lib/types"

/* =========================
   FETCH
========================= */

export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      course:course_id (
        subject,
        grade,
        group_number
      )
    `)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true })

  if (error) {
    console.error("Error fetching students:", error)
    throw error
  }

  return data.map((student: StudentDB & { course?: any }) => {
    const courseName = student.course
      ? formatCourseName(
          student.course.subject,
          student.course.grade,
          student.course.group_number
        )
      : undefined

    return dbStudentToFrontend(student, courseName)
  })
}

export async function fetchStudentById(id: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      course:course_id (
        subject,
        grade,
        group_number
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching student:", error)
    return null
  }

  const courseName = data.course
    ? formatCourseName(data.course.subject, data.course.grade, data.course.group_number)
    : undefined

  return dbStudentToFrontend(data, courseName)
}

export async function fetchStudentsByCourse(courseId: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      course:course_id (
        subject,
        grade,
        group_number
      )
    `)
    .eq("course_id", courseId)
    .order("last_name", { ascending: true })

  if (error) {
    console.error("Error fetching students by course:", error)
    throw error
  }

  return data.map((student: StudentDB & { course?: any }) => {
    const courseName = student.course
      ? formatCourseName(
          student.course.subject,
          student.course.grade,
          student.course.group_number
        )
      : undefined

    return dbStudentToFrontend(student, courseName)
  })
}

/* =========================
   CREATE
========================= */

export interface CreateStudentData {
  firstName: string
  lastName: string
  gender: "masculino" | "femenino" | "otro"
  documentNumber: string
  courseId?: string
  grades?: Grades
  birthDate?: string
  documentType?: "TI" | "CC" | "RC" | "CE" | "PEP"
  status?: "active" | "inactive" | "transferred" | "graduated"
  notes?: string
}

export async function createStudent(student: CreateStudentData): Promise<Student> {
  const { data, error } = await supabase
    .from("students")
    .insert({
      first_name: student.firstName,
      last_name: student.lastName,
      gender: student.gender,
      document_number: student.documentNumber,
      document_type: student.documentType ?? "TI",
      course_id: student.courseId ?? null,
      status: student.status ?? "active",
      birth_date: student.birthDate,
      notes: student.notes,
      grades: student.grades ?? {
        p1: [],
        p2: [],
        p3: [],
        p4: [],
      },
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating student:", error)
    throw error
  }

  if (student.courseId) {
    await updateCourseStudentCount(student.courseId)
  }

  return dbStudentToFrontend(data as StudentDB)
}

/* =========================
   UPDATE
========================= */

export type UpdateStudentData = {
  firstName?: string
  lastName?: string
  courseId?: string | null
  notes?: string
  grades?: Partial<Grades>
}

export async function updateStudent(
  id: string,
  updates: UpdateStudentData
): Promise<Student> {
  const dbUpdates: Record<string, unknown> = {}

  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
  if (updates.courseId !== undefined) dbUpdates.course_id = updates.courseId
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes

  if (updates.grades !== undefined) {
    dbUpdates.grades = updates.grades
  }

  const { data, error } = await supabase
    .from("students")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating student:", error)
    throw error
  }

  return dbStudentToFrontend(data as StudentDB)
}

/* =========================
   DELETE
========================= */

export async function deleteStudent(id: string): Promise<void> {
  const { data: student } = await supabase
    .from("students")
    .select("course_id")
    .eq("id", id)
    .single()

  const courseId = student?.course_id

  const { error } = await supabase.from("students").delete().eq("id", id)

  if (error) {
    console.error("Error deleting student:", error)
    throw error
  }

  if (courseId) {
    await updateCourseStudentCount(courseId)
  }
}

/* =========================
   HELPERS
========================= */

async function updateCourseStudentCount(courseId: string): Promise<void> {
  const { count, error } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId)

  if (error) {
    console.error("Error counting students:", error)
    return
  }

  await supabase
    .from("courses")
    .update({ students_count: count ?? 0 })
    .eq("id", courseId)
}
