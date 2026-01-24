"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Student, Course } from "@/lib/types"
import type { CreateStudentData } from "@/lib/students-service"
import { User, GraduationCap, Heart, Users, Phone, Loader2 } from "lucide-react"
import useSWR from "swr"
import { fetchCourses } from "@/lib/courses-service"

interface StudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student?: Student | null
  onSave: (student: CreateStudentData & { id?: string }) => Promise<void>
}

const documentTypes = [
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "RC", label: "Registro Civil" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PEP", label: "PEP" },
]

const genderOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
]

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const guardianRelationships = ["Padre", "Madre", "Abuelo/a", "Tío/a", "Hermano/a", "Tutor Legal", "Otro"]

const statusOptions = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "transferred", label: "Trasladado" },
  { value: "graduated", label: "Graduado" },
]

export function StudentDialog({ open, onOpenChange, student, onSave }: StudentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const { data: courses = [] } = useSWR<Course[]>("courses", fetchCourses)

  const [formData, setFormData] = useState<CreateStudentData>({
    firstName: "",
    lastName: "",
    gender: "masculino",
    birthDate: "",
    documentType: "TI",
    documentNumber: "",
    courseId: "",
    status: "active",
    bloodType: "",
    healthInsurance: "",
    disabilities: "",
    specialNeeds: "",
    allergies: "",
    email: "",
    phone: "",
    address: "",
    neighborhood: "",
    city: "Bogotá",
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    notes: "",
  })

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        birthDate: student.birthDate,
        documentType: student.documentType,
        documentNumber: student.documentNumber,
        courseId: student.courseId || "",
        status: student.status,
        bloodType: student.bloodType,
        healthInsurance: student.healthInsurance,
        disabilities: student.disabilities,
        specialNeeds: student.specialNeeds,
        allergies: student.allergies,
        email: student.email,
        phone: student.phone,
        address: student.address,
        neighborhood: student.neighborhood,
        city: student.city,
        guardianName: student.guardianName,
        guardianRelationship: student.guardianRelationship,
        guardianPhone: student.guardianPhone,
        guardianEmail: student.guardianEmail,
        guardianOccupation: student.guardianOccupation,
        guardianAddress: student.guardianAddress,
        emergencyContactName: student.emergencyContactName,
        emergencyContactPhone: student.emergencyContactPhone,
        emergencyContactRelationship: student.emergencyContactRelationship,
        notes: student.notes,
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        gender: "masculino",
        birthDate: "",
        documentType: "TI",
        documentNumber: "",
        courseId: "",
        status: "active",
        bloodType: "",
        healthInsurance: "",
        disabilities: "",
        specialNeeds: "",
        allergies: "",
        email: "",
        phone: "",
        address: "",
        neighborhood: "",
        city: "Bogotá",
        guardianName: "",
        guardianRelationship: "",
        guardianPhone: "",
        guardianEmail: "",
        guardianOccupation: "",
        guardianAddress: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        notes: "",
      })
    }
    setActiveTab("personal")
  }, [student, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (student) {
        await onSave({ ...formData, id: student.id })
      } else {
        await onSave(formData)
      }
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving student:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof CreateStudentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">{student ? "Editar Estudiante" : "Nuevo Estudiante"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal" className="gap-1 text-xs">
                  <User className="h-3 w-3" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="academic" className="gap-1 text-xs">
                  <GraduationCap className="h-3 w-3" />
                  Académico
                </TabsTrigger>
                <TabsTrigger value="health" className="gap-1 text-xs">
                  <Heart className="h-3 w-3" />
                  Salud
                </TabsTrigger>
                <TabsTrigger value="guardian" className="gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  Acudiente
                </TabsTrigger>
                <TabsTrigger value="contact" className="gap-1 text-xs">
                  <Phone className="h-3 w-3" />
                  Contacto
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[400px] px-6 py-4">
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombres *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          placeholder="Ej: Juan Pablo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellidos *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          placeholder="Ej: Martínez López"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Género *</Label>
                        <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => updateField("birthDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentType">Tipo de Documento</Label>
                        <Select
                          value={formData.documentType}
                          onValueChange={(value) => updateField("documentType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="documentNumber">Número de Documento</Label>
                        <Input
                          id="documentNumber"
                          value={formData.documentNumber}
                          onChange={(e) => updateField("documentNumber", e.target.value)}
                          placeholder="Ej: 1000123456"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Academic Information Tab */}
              <TabsContent value="academic" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseId">Curso *</Label>
                      <Select value={formData.courseId || ""} onValueChange={(value) => updateField("courseId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas Adicionales</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        placeholder="Observaciones generales sobre el estudiante..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Health Information Tab */}
              <TabsContent value="health" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Tipo de Sangre</Label>
                        <Select value={formData.bloodType} onValueChange={(value) => updateField("bloodType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="healthInsurance">EPS / Seguro de Salud</Label>
                        <Input
                          id="healthInsurance"
                          value={formData.healthInsurance}
                          onChange={(e) => updateField("healthInsurance", e.target.value)}
                          placeholder="Ej: Sanitas, Nueva EPS..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="disabilities">Discapacidades</Label>
                      <Textarea
                        id="disabilities"
                        value={formData.disabilities}
                        onChange={(e) => updateField("disabilities", e.target.value)}
                        placeholder="Describir si el estudiante tiene alguna discapacidad..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialNeeds">Necesidades Especiales</Label>
                      <Textarea
                        id="specialNeeds"
                        value={formData.specialNeeds}
                        onChange={(e) => updateField("specialNeeds", e.target.value)}
                        placeholder="TDAH, dislexia, apoyo pedagógico, etc..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergies">Alergias</Label>
                      <Textarea
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => updateField("allergies", e.target.value)}
                        placeholder="Alergias alimentarias, medicamentos, etc..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Guardian Information Tab */}
              <TabsContent value="guardian" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">Acudiente Principal</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardianName">Nombre Completo</Label>
                        <Input
                          id="guardianName"
                          value={formData.guardianName}
                          onChange={(e) => updateField("guardianName", e.target.value)}
                          placeholder="Ej: María López García"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardianRelationship">Parentesco</Label>
                        <Select
                          value={formData.guardianRelationship}
                          onValueChange={(value) => updateField("guardianRelationship", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {guardianRelationships.map((rel) => (
                              <SelectItem key={rel} value={rel}>
                                {rel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardianPhone">Teléfono</Label>
                        <Input
                          id="guardianPhone"
                          type="tel"
                          value={formData.guardianPhone}
                          onChange={(e) => updateField("guardianPhone", e.target.value)}
                          placeholder="300 123 4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardianEmail">Correo Electrónico</Label>
                        <Input
                          id="guardianEmail"
                          type="email"
                          value={formData.guardianEmail}
                          onChange={(e) => updateField("guardianEmail", e.target.value)}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardianOccupation">Ocupación</Label>
                        <Input
                          id="guardianOccupation"
                          value={formData.guardianOccupation}
                          onChange={(e) => updateField("guardianOccupation", e.target.value)}
                          placeholder="Ej: Ingeniero, Docente..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardianAddress">Dirección</Label>
                        <Input
                          id="guardianAddress"
                          value={formData.guardianAddress}
                          onChange={(e) => updateField("guardianAddress", e.target.value)}
                          placeholder="Calle 123 # 45-67"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-4">
                        Contacto de Emergencia Adicional
                      </h4>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactName">Nombre</Label>
                          <Input
                            id="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={(e) => updateField("emergencyContactName", e.target.value)}
                            placeholder="Nombre completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                          <Input
                            id="emergencyContactPhone"
                            type="tel"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                            placeholder="300 123 4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactRelationship">Parentesco</Label>
                          <Input
                            id="emergencyContactRelationship"
                            value={formData.emergencyContactRelationship}
                            onChange={(e) => updateField("emergencyContactRelationship", e.target.value)}
                            placeholder="Ej: Tía"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value="contact" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">Contacto del Estudiante</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="estudiante@ejemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="300 123 4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección de Residencia</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="Calle 123 # 45-67, Apartamento 101"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Barrio</Label>
                        <Input
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) => updateField("neighborhood", e.target.value)}
                          placeholder="Ej: Chapinero, Kennedy..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          placeholder="Bogotá"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="flex justify-end gap-2 p-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {student ? "Guardar Cambios" : "Crear Estudiante"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
