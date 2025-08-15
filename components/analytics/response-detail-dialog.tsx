"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"
import type { Form, FormResponse } from "@/lib/forms"

interface ResponseDetailDialogProps {
  form: Form
  response: FormResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResponseDetailDialog({ form, response, open, onOpenChange }: ResponseDetailDialogProps) {
  if (!response) return null

  const formatValue = (field: any, value: any) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">No response</span>
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {String(item)}
            </Badge>
          ))}
        </div>
      )
    }

    if (value instanceof File) {
      return (
        <div className="flex items-center gap-2">
          <Icon icon="solar:document-bold-duotone" className="w-4 h-4" />
          <span>{value.name}</span>
          <Badge variant="outline" className="text-xs">
            {(value.size / 1024).toFixed(1)} KB
          </Badge>
        </div>
      )
    }

    if (field.type === "email") {
      return (
        <a href={`mailto:${value}`} className="text-primary hover:underline">
          {String(value)}
        </a>
      )
    }

    if (field.type === "date") {
      return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    return <span className="whitespace-pre-wrap">{String(value)}</span>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold">Response Details</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="font-mono">
                {response.id}
              </Badge>
              <span className="text-sm text-muted-foreground">Submitted {formatDate(response.submittedAt)}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-base">{field.label}</h4>
                {field.required && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              <div className="pl-4 border-l-2 border-border">{formatValue(field, response.responses[field.id])}</div>
            </div>
          ))}
        </div>

        {response.ipAddress && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">IP Address: {response.ipAddress}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
