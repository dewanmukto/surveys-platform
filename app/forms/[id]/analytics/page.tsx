"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponseTable } from "@/components/analytics/response-table"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { ResponseDetailDialog } from "@/components/analytics/response-detail-dialog"
import { FormsService, type Form, type FormResponse } from "@/lib/forms"
import { exportToCSV, downloadCSV } from "@/lib/export-utils"
import { Icon } from "@iconify/react"

export default function FormAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      loadFormAndResponses(params.id)
    }
  }, [params.id])

  const loadFormAndResponses = async (formId: string) => {
    try {
      const [formData, responsesData] = await Promise.all([
        FormsService.getForm(formId),
        FormsService.getFormResponses(formId),
      ])

      if (!formData) {
        router.push("/dashboard")
        return
      }

      setForm(formData)
      setResponses(responsesData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!form || responses.length === 0) return

    const csvContent = exportToCSV(form, responses)
    const filename = `${form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_responses_${new Date().toISOString().split("T")[0]}.csv`
    downloadCSV(filename, csvContent)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <div className="text-center">
            <Icon icon="solar:refresh-bold-duotone" className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!form) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <div className="text-center">
            <Icon icon="solar:danger-circle-bold-duotone" className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-4">The form you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/dashboard")}>
              <Icon icon="solar:arrow-left-bold-duotone" className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        {/* Header */}
        <header className="glass-strong sticky top-0 z-50 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                  <Icon icon="solar:arrow-left-bold-duotone" className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:document-text-bold-duotone" className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-heading font-black text-foreground">Surveys</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push(`/forms/${form.id}/edit`)}>
                  <Icon icon="solar:pen-bold-duotone" className="w-4 h-4 mr-2" />
                  Edit Form
                </Button>
                <Button variant="outline" onClick={handleExportCSV} disabled={responses.length === 0}>
                  <Icon icon="solar:download-bold-duotone" className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-heading font-bold">{form.title}</h2>
              {form.description && <p className="text-muted-foreground mt-1">{form.description}</p>}
            </div>
          </div>
        </header>

        {/* Analytics Content */}
        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Icon icon="solar:chart-square-bold-duotone" className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="responses" className="flex items-center gap-2">
                <Icon icon="solar:list-bold-duotone" className="w-4 h-4" />
                Responses ({responses.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <AnalyticsCharts form={form} responses={responses} />
            </TabsContent>

            <TabsContent value="responses">
              <ResponseTable
                form={form}
                responses={responses}
                onViewResponse={setSelectedResponse}
                onExportCSV={handleExportCSV}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Response Detail Dialog */}
        <ResponseDetailDialog
          form={form}
          response={selectedResponse}
          open={!!selectedResponse}
          onOpenChange={(open) => !open && setSelectedResponse(null)}
        />
      </div>
    </ProtectedRoute>
  )
}
