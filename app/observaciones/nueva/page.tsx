import { AppShell } from "@/components/layout/app-shell"
import { NewObservationForm } from "@/components/observations/new-observation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NuevaObservacionPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Link href="/observaciones">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nueva Observación</h1>
            <p className="text-muted-foreground">Registra una observación académica o comportamental</p>
          </div>
        </div>

        <NewObservationForm />
      </div>
    </AppShell>
  )
}
