"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FieldPalette } from "@/components/form-builder/field-palette"
import { FormPreview } from "@/components/form-builder/form-preview"
import { FieldEditor } from "@/components/form-builder/field-editor"
import { FormsService, type Form, type FormField } from "@/lib/forms"
import { Icon } from "@iconify/react"

export default function FormEditPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState<Form | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      loadForm(params.id)
    }
  }, [params.id])

  const loadForm = async (formId: string) => {
    try {
      const formData = await FormsService.getForm(formId)
      if (!formData) {
        router.push("/dashboard")
        return
      }
      setForm(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddField = (field: FormField) => {
    if (!form) return
    const updatedForm = { ...form, fields: [...form.fields, field] }
    setForm(updatedForm)
    setSelectedFieldId(field.id)
  }

  const handleUpdateField = (updatedField: FormField) => {
    if (!form) return
    const updatedForm = {
      ...form,
      fields: form.fields.map((field) => (field.id === updatedField.id ? updatedField : field)),
    }
    setForm(updatedForm)
  }

  const handleDeleteField = (fieldId: string) => {
    if (!form) return
    const updatedForm = { ...form, fields: form.fields.filter((field) => field.id !== fieldId) }
    setForm(updatedForm)
    setSelectedFieldId(null)
  }

  const handleSaveForm = async () => {
    if (!form) return
    setIsSaving(true)
    try {
      await FormsService.updateForm(form.id, form)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublishForm = async () => {
    if (!form) return
    setIsSaving(true)
    try {
      const updatedForm = await FormsService.updateForm(form.id, { isPublished: !form.isPublished })
      if (updatedForm) {
        setForm(updatedForm)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const selectedField = form?.fields.find((field) => field.id === selectedFieldId) || null

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading form editor..." />
        </div>
      </ProtectedRoute>
    )
  }

  if (!form) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <Icon icon="solar:danger-circle-bold-duotone" className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The form you're looking for doesn't exist or you don't have permission to edit it.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full sm:w-auto">
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push("/dashboard")} className="touch-target">
                  <Icon icon="solar:arrow-left-bold-duotone" className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:document-text-bold-duotone" className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-heading font-black text-foreground">Surveys</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={handleSaveForm}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none touch-target"
                >
                  {isSaving ? (
                    <Icon icon="solar:refresh-bold-duotone" className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Icon icon="solar:diskette-bold-duotone" className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
                <Button onClick={handlePublishForm} disabled={isSaving} className="flex-1 sm:flex-none touch-target">
                  <Icon
                    icon={form.isPublished ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"}
                    className="w-4 h-4 mr-2"
                  />
                  {form.isPublished ? "Unpublish" : "Publish"}
                </Button>
              </div>
            </div>

            {/* Form Title and Description */}
            <div className="mt-4 space-y-2">
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="text-xl sm:text-2xl font-heading font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 responsive-text-lg"
                placeholder="Untitled Form"
              />
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-transparent border-none p-0 resize-none focus-visible:ring-0 responsive-text-base"
                placeholder="Form description (optional)"
                rows={2}
              />
            </div>
          </div>
        </header>

        {/* Form Builder */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Field Palette */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="sticky top-24">
                <FieldPalette onAddField={handleAddField} />
              </div>
            </div>

            {/* Form Preview */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <FormPreview
                form={form}
                selectedFieldId={selectedFieldId}
                onFieldSelect={setSelectedFieldId}
                onAddField={() => {
                  // Focus on first field type for quick add
                  const firstFieldType = "text"
                  const field = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: firstFieldType as FormField["type"],
                    label: "New Question",
                    required: false,
                    placeholder: "Enter your answer",
                  }
                  handleAddField(field)
                }}
              />
            </div>

            {/* Field Editor */}
            <div className="lg:col-span-3 order-3">
              <div className="sticky top-24">
                <FieldEditor
                  field={selectedField}
                  onUpdateField={handleUpdateField}
                  onDeleteField={handleDeleteField}
                  onClose={() => setSelectedFieldId(null)}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
