"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FormsTable } from "@/components/dashboard/forms-table"
import { CreateFormDialog } from "@/components/dashboard/create-form-dialog"
import { FormsService, type Form } from "@/lib/forms"
import { Icon } from "@iconify/react"

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [forms, setForms] = useState<Form[]>([])
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    publishedForms: 0,
    recentActivity: [] as Array<{ type: string; message: string; timestamp: string }>,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      const [userForms, dashboardStats] = await Promise.all([
        FormsService.getUserForms(user.id),
        FormsService.getDashboardStats(user.id),
      ])

      setForms(userForms)
      setStats(dashboardStats)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForm = async (title: string, description: string) => {
    if (!user) return

    const newForm = await FormsService.createForm(user.id, title, description)
    setForms((prev) => [newForm, ...prev])
    setStats((prev) => ({ ...prev, totalForms: prev.totalForms + 1 }))
  }

  const handleEditForm = (form: Form) => {
    // TODO: Navigate to form builder
    console.log("Edit form:", form.id)
  }

  const handleDeleteForm = async (formId: string) => {
    const success = await FormsService.deleteForm(formId)
    if (success) {
      setForms((prev) => prev.filter((f) => f.id !== formId))
      setStats((prev) => ({ ...prev, totalForms: prev.totalForms - 1 }))
    }
  }

  const handleTogglePublish = async (formId: string, isPublished: boolean) => {
    const updatedForm = await FormsService.updateForm(formId, { isPublished })
    if (updatedForm) {
      setForms((prev) => prev.map((f) => (f.id === formId ? updatedForm : f)))
      setStats((prev) => ({
        ...prev,
        publishedForms: isPublished ? prev.publishedForms + 1 : prev.publishedForms - 1,
      }))
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <div className="text-center">
            <Icon icon="solar:refresh-bold-duotone" className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
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
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:document-text-bold-duotone" className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-heading font-black text-foreground">Surveys</h1>
            </div>
            <div className="flex items-center gap-4">
              <CreateFormDialog onCreateForm={handleCreateForm}>
                <Button className="font-medium">
                  <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
                  New Form
                </Button>
              </CreateFormDialog>
              <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {user?.name}</span>
              <Button variant="ghost" onClick={signOut} className="font-medium">
                <Icon icon="solar:logout-2-bold-duotone" className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Manage your forms and track responses</p>
          </div>

          {/* Stats Cards */}
          <StatsCards
            totalForms={stats.totalForms}
            totalResponses={stats.totalResponses}
            publishedForms={stats.publishedForms}
          />

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <CreateFormDialog onCreateForm={handleCreateForm}>
              <Card className="glass cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <Icon icon="solar:add-circle-bold-duotone" className="w-10 h-10 text-primary mx-auto mb-2" />
                  <CardTitle className="font-heading font-bold text-sm">Create Form</CardTitle>
                </CardHeader>
              </Card>
            </CreateFormDialog>

            <Card className="glass cursor-pointer hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <Icon icon="solar:folder-bold-duotone" className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle className="font-heading font-bold text-sm">Templates</CardTitle>
              </CardHeader>
            </Card>

            <Card className="glass cursor-pointer hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <Icon icon="solar:chart-square-bold-duotone" className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle className="font-heading font-bold text-sm">Analytics</CardTitle>
              </CardHeader>
            </Card>

            <Card className="glass cursor-pointer hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <Icon icon="solar:settings-bold-duotone" className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle className="font-heading font-bold text-sm">Settings</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Forms Table */}
          <FormsTable
            forms={forms}
            onEdit={handleEditForm}
            onDelete={handleDeleteForm}
            onTogglePublish={handleTogglePublish}
          />

          {/* Recent Activity */}
          {stats.recentActivity.length > 0 && (
            <Card className="glass mt-8">
              <CardHeader>
                <CardTitle className="font-heading font-bold">Recent Activity</CardTitle>
                <CardDescription>Your latest form and response activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Icon icon="solar:history-bold-duotone" className="w-4 h-4 text-primary" />
                      <span className="text-sm">{activity.message}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        {/* Footer */}
        <footer className="glass-strong border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Icon icon="solar:document-text-bold-duotone" className="w-6 h-6 text-primary" />
                <span className="font-heading font-bold text-foreground">Surveys</span>
              </div>
              <p className="text-muted-foreground text-sm">© 2025 Dewan Mukto Co.</p>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
