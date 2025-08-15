"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormFieldRenderer } from "@/components/form-renderer/form-field-renderer"
import { FormsService, type Form } from "@/lib/forms"
import { validateFormResponse, type ValidationError } from "@/lib/form-validation"
import { Icon } from "@iconify/react"

export default function FormPage() {
  const params = useParams()
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      loadForm(params.id)
    }
  }, [params.id])

  const loadForm = async (formId: string) => {
    try {
      const formData = await FormsService.getForm(formId)
      if (!formData || !formData.isPublished) {
        setForm(null)
      } else {
        setForm(formData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error for this field when user starts typing
    setErrors((prev) => prev.filter((error) => error.fieldId !== fieldId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    // Validate form
    const validationErrors = validateFormResponse(form.fields, responses)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      // Scroll to first error
      const firstErrorField = document.getElementById(`field-${validationErrors[0].fieldId}`)
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setIsSubmitting(true)
    try {
      await FormsService.submitResponse(form.id, responses)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Failed to submit form:", error)
      // Handle submission error
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (fieldId: string) => {
    return errors.find((error) => error.fieldId === fieldId)?.message
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-center">
          <Icon icon="solar:refresh-bold-duotone" className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
        <Card className="glass max-w-md w-full text-center">
          <CardContent className="p-8">
            <Icon icon="solar:danger-circle-bold-duotone" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold mb-2">Form Not Available</h2>
            <p className="text-muted-foreground">
              This form is either not published, doesn't exist, or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
        <Card className="glass max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="solar:check-circle-bold-duotone" className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Your response has been submitted successfully.</p>
            <Button
              variant="ghost"
              onClick={() => {
                setIsSubmitted(false)
                setResponses({})
                setErrors([])
              }}
            >
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="glass-strong border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Icon icon="solar:document-text-bold-duotone" className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-heading font-black text-foreground">Surveys</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-2xl font-heading font-bold">{form.title}</CardTitle>
            {form.description && <p className="text-muted-foreground mt-2">{form.description}</p>}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} id={`field-${field.id}`}>
                  <FormFieldRenderer
                    field={field}
                    value={responses[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={getFieldError(field.id)}
                  />
                </div>
              ))}

              {errors.length > 0 && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="solar:danger-circle-bold-duotone" className="w-5 h-5 text-destructive" />
                    <h3 className="font-medium text-destructive">Please fix the following errors:</h3>
                  </div>
                  <ul className="text-sm text-destructive space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? (
                    <Icon icon="solar:refresh-bold-duotone" className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Icon icon="solar:paper-bin-bold-duotone" className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Form Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-heading font-semibold text-foreground">Surveys</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">© 2025 Dewan Mukto Co.</p>
        </div>
      </main>
    </div>
  )
}
