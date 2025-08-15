"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FieldPreview } from "./field-preview"
import { Icon } from "@iconify/react"
import type { Form } from "@/lib/forms"

interface FormPreviewProps {
  form: Form
  selectedFieldId?: string
  onFieldSelect: (fieldId: string) => void
  onAddField: () => void
}

export function FormPreview({ form, selectedFieldId, onFieldSelect, onAddField }: FormPreviewProps) {
  return (
    <Card className="glass flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading font-bold text-xl">{form.title || "Untitled Form"}</CardTitle>
            {form.description && <p className="text-muted-foreground mt-1">{form.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Icon icon="solar:eye-bold-duotone" className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="ghost" size="sm">
              <Icon icon="solar:settings-bold-duotone" className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {form.fields.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:widget-add-bold-duotone" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">Start Building Your Form</h3>
            <p className="text-muted-foreground mb-6">Add fields from the sidebar to create your form</p>
            <Button onClick={onAddField}>
              <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
              Add Your First Field
            </Button>
          </div>
        ) : (
          <>
            {form.fields.map((field) => (
              <FieldPreview
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                onClick={() => onFieldSelect(field.id)}
              />
            ))}
            <Button
              variant="ghost"
              className="w-full border-2 border-dashed border-border hover:border-primary/50 h-12 glass bg-transparent"
              onClick={onAddField}
            >
              <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
