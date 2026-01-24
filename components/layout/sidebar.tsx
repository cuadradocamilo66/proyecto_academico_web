"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Settings,
  GraduationCap,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Cursos", href: "/cursos", icon: BookOpen },
  { name: "Estudiantes", href: "/estudiantes", icon: Users },
  { name: "Planeación", href: "/planeacion", icon: Calendar },
  { name: "Diario de Campo", href: "/diario", icon: FileText },
  { name: "Calificaciones", href: "/calificaciones", icon: ClipboardList },
  { name: "Observaciones", href: "/observaciones", icon: AlertTriangle },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Agenda", href: "/agenda", icon: CalendarDays },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <GraduationCap className="h-8 w-8 text-sidebar-primary" />
        <span className="text-lg font-semibold">EduGestión</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
