// ===============================
// Database types for Supabase
// ===============================

export interface CourseDB {
  id: string
  subject: string
  grade: number
  group_number: number
  schedule: string | null
  students_count: number
  color: string
  created_at: string
  updated_at: string
}

// ===============================
// Frontend Course
// ===============================

export interface Course {
  id: string
  name: string
  subject: string
  grade: number
  groupNumber: number
  schedule: string
  students: number
  color: string
}

export function formatCourseName(
  subject: string,
  grade: number,
  groupNumber: number
): string {
  return `${subject} ${grade}-${groupNumber}`
}

export function dbCourseToFrontend(dbCourse: CourseDB): Course {
  return {
    id: dbCourse.id,
    name: formatCourseName(
      dbCourse.subject,
      dbCourse.grade,
      dbCourse.group_number
    ),
    subject: dbCourse.subject,
    grade: dbCourse.grade,
    groupNumber: dbCourse.group_number,
    schedule: dbCourse.schedule || "",
    students: dbCourse.students_count,
    color: dbCourse.color,
  }
}

// ===============================
// GRADES (MODELO FINAL)
// ===============================

export type GradeItem = {
  value: number
  title?: string
  createdAt: string
}

export type Grades = {
  p1: GradeItem[]
  p2: GradeItem[]
  p3: GradeItem[]
  p4: GradeItem[]
}

// helper seguro
export const emptyGrades: Grades = {
  p1: [],
  p2: [],
  p3: [],
  p4: [],
}

// ===============================
// Student DB (Supabase)
// ===============================

export interface StudentDB {
  id: string
  first_name: string
  last_name: string
  gender: "masculino" | "femenino" | "otro"
  birth_date: string
  document_type: "TI" | "CC" | "RC" | "CE" | "PEP"
  document_number: string | null
  course_id: string | null
  enrollment_date: string
  status: "active" | "inactive" | "transferred" | "graduated"
  blood_type: string | null
  health_insurance: string | null
  disabilities: string | null
  special_needs: string | null
  allergies: string | null
  email: string | null
  phone: string | null
  address: string | null
  neighborhood: string | null
  city: string | null
  guardian_name: string | null
  guardian_relationship: string | null
  guardian_phone: string | null
  guardian_email: string | null
  guardian_occupation: string | null
  guardian_address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  photo_url: string | null
  notes: string | null

  // ✅ jsonb con objetos
  grades: Grades | null

  created_at: string
  updated_at: string
}

// ===============================
// Student Frontend
// ===============================

export interface Student {
  id: string
  firstName: string
  lastName: string
  fullName: string
  gender: "masculino" | "femenino" | "otro"
  birthDate: string
  age: number
  documentType: "TI" | "CC" | "RC" | "CE" | "PEP"
  documentNumber: string
  courseId: string | null
  courseName?: string
  enrollmentDate: string
  status: "active" | "inactive" | "transferred" | "graduated"
  bloodType: string
  healthInsurance: string
  disabilities: string
  specialNeeds: string
  allergies: string
  email: string
  phone: string
  address: string
  neighborhood: string
  city: string
  guardianName: string
  guardianRelationship: string
  guardianPhone: string
  guardianEmail: string
  guardianOccupation: string
  guardianAddress: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  photoUrl: string
  notes: string

  // ✅ mismo modelo que DB
  grades: Grades
}

// ===============================
// Update Student
// ===============================

export type UpdateStudentData = {
  grades?: Grades
}

// ===============================
// Helpers
// ===============================

export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--
  }
  return age
}

// ===============================
// DB → Frontend mapper
// ===============================

export function dbStudentToFrontend(
  dbStudent: StudentDB,
  courseName?: string
): Student {
  return {
    id: dbStudent.id,
    firstName: dbStudent.first_name,
    lastName: dbStudent.last_name,
    fullName: `${dbStudent.first_name} ${dbStudent.last_name}`,
    gender: dbStudent.gender,
    birthDate: dbStudent.birth_date,
    age: calculateAge(dbStudent.birth_date),
    documentType: dbStudent.document_type,
    documentNumber: dbStudent.document_number || "",
    courseId: dbStudent.course_id,
    courseName,
    enrollmentDate: dbStudent.enrollment_date,
    status: dbStudent.status,
    bloodType: dbStudent.blood_type || "",
    healthInsurance: dbStudent.health_insurance || "",
    disabilities: dbStudent.disabilities || "",
    specialNeeds: dbStudent.special_needs || "",
    allergies: dbStudent.allergies || "",
    email: dbStudent.email || "",
    phone: dbStudent.phone || "",
    address: dbStudent.address || "",
    neighborhood: dbStudent.neighborhood || "",
    city: dbStudent.city || "Bogotá",
    guardianName: dbStudent.guardian_name || "",
    guardianRelationship: dbStudent.guardian_relationship || "",
    guardianPhone: dbStudent.guardian_phone || "",
    guardianEmail: dbStudent.guardian_email || "",
    guardianOccupation: dbStudent.guardian_occupation || "",
    guardianAddress: dbStudent.guardian_address || "",
    emergencyContactName: dbStudent.emergency_contact_name || "",
    emergencyContactPhone: dbStudent.emergency_contact_phone || "",
    emergencyContactRelationship:
      dbStudent.emergency_contact_relationship || "",
    photoUrl: dbStudent.photo_url || "",
    notes: dbStudent.notes || "",

    // ✅ SIEMPRE estructura válida
    grades: dbStudent.grades ?? emptyGrades,
  }
}
