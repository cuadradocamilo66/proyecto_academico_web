"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Palette, Lock, Save } from "lucide-react"

export function SettingsView() {
  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Información Personal</CardTitle>
          </div>
          <CardDescription>Actualiza tu información de perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" defaultValue="María González" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" defaultValue="maria.gonzalez@colegio.edu" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" defaultValue="+57 300 123 4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institución</Label>
              <Input id="institution" defaultValue="Colegio Ejemplo" />
            </div>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Guardar cambios
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Notificaciones</CardTitle>
          </div>
          <CardDescription>Configura tus preferencias de notificaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Alertas de bajo rendimiento</p>
              <p className="text-xs text-muted-foreground">
                Recibe alertas cuando un estudiante tenga promedio menor a 3.0
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Recordatorios de planeación</p>
              <p className="text-xs text-muted-foreground">Recibe recordatorios para completar tu planeación semanal</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Notificaciones por correo</p>
              <p className="text-xs text-muted-foreground">Recibe resúmenes semanales por correo electrónico</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Apariencia</CardTitle>
          </div>
          <CardDescription>Personaliza la apariencia de la plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select defaultValue="light">
              <SelectTrigger className="w-48 bg-transparent">
                <SelectValue placeholder="Seleccionar tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select defaultValue="es">
              <SelectTrigger className="w-48 bg-transparent">
                <SelectValue placeholder="Seleccionar idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Seguridad</CardTitle>
          </div>
          <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="bg-transparent">
            Cambiar contraseña
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Autenticación de dos factores</p>
              <p className="text-xs text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
