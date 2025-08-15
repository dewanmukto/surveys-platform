"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FormShareDialog } from "@/components/form-builder/form-share-dialog"
import { Icon } from "@iconify/react"
import type { Form } from "@/lib/forms"

interface FormsTableProps {
  forms: Form[]
  onEdit: (form: Form) => void
  onDelete: (formId: string) => void
  onTogglePublish: (formId: string, isPublished: boolean) => void
}

export function FormsTable({ forms, onEdit, onDelete, onTogglePublish }: FormsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (formId: string) => {
    setDeletingId(formId)
    await onDelete(formId)
    setDeletingId(null)
  }

  const handleEdit = (form: Form) => {
    router.push(`/forms/${form.id}/edit`)
  }

  const handleViewAnalytics = (form: Form) => {
    router.push(`/forms/${form.id}/analytics`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (forms.length === 0) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-heading font-bold">Your Forms</CardTitle>
          <CardDescription>Create and manage your forms and surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Icon icon="solar:document-add-bold-duotone" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">No forms created yet</h3>
            <p className="text-muted-foreground mb-6">Get started by creating your first form or survey</p>
            <Button>
              <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
              Create Your First Form
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="font-heading font-bold">Your Forms</CardTitle>
        <CardDescription>Create and manage your forms and surveys</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg glass bg-card/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-semibold text-lg">{form.title}</h3>
                  <Badge variant={form.isPublished ? "default" : "secondary"}>
                    {form.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{form.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:calendar-bold-duotone" className="w-3 h-3" />
                    Created {formatDate(form.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:chart-square-bold-duotone" className="w-3 h-3" />
                    {form.responseCount} responses
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:widget-add-bold-duotone" className="w-3 h-3" />
                    {form.fields.length} fields
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onTogglePublish(form.id, !form.isPublished)}>
                  <Icon
                    icon={form.isPublished ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"}
                    className="w-4 h-4"
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon icon="solar:menu-dots-bold-duotone" className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass">
                    <DropdownMenuItem onClick={() => handleEdit(form)}>
                      <Icon icon="solar:pen-bold-duotone" className="w-4 h-4 mr-2" />
                      Edit Form
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon icon="solar:copy-bold-duotone" className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewAnalytics(form)}>
                      <Icon icon="solar:chart-square-bold-duotone" className="w-4 h-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <FormShareDialog form={form}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Icon icon="solar:share-bold-duotone" className="w-4 h-4 mr-2" />
                        Share Form
                      </DropdownMenuItem>
                    </FormShareDialog>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(form.id)}
                      disabled={deletingId === form.id}
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4 h-4 mr-2" />
                      {deletingId === form.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
