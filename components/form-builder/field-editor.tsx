"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import type { FormField } from "@/lib/forms"

interface FieldEditorProps {
  field: FormField | null
  onUpdateField: (field: FormField) => void
  onDeleteField: (fieldId: string) => void
  onClose: () => void
}

export function FieldEditor({ field, onUpdateField, onDeleteField, onClose }: FieldEditorProps) {
  const [localField, setLocalField] = useState<FormField | null>(field)

  if (!field || !localField) {
    return (
      <Card className="glass h-fit">
        <CardContent className="p-6 text-center">
          <Icon icon="solar:widget-add-bold-duotone" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a field to edit its properties</p>
        </CardContent>
      </Card>
    )
  }

  const updateField = (updates: Partial<FormField>) => {
    const updatedField = { ...localField, ...updates }
    setLocalField(updatedField)
    onUpdateField(updatedField)
  }

  const addOption = () => {
    const options = localField.options || []
    updateField({ options: [...options, `Option ${options.length + 1}`] })
  }

  const updateOption = (index: number, value: string) => {
    const options = [...(localField.options || [])]
    options[index] = value
    updateField({ options })
  }

  const removeOption = (index: number) => {
    const options = [...(localField.options || [])]
    options.splice(index, 1)
    updateField({ options })
  }

  const hasOptions = ["select", "radio", "checkbox"].includes(localField.type)

  return (
    <Card className="glass h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-heading font-bold text-lg">Field Settings</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Icon icon="solar:close-circle-bold-duotone" className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Field Label */}
        <div className="space-y-2">
          <Label htmlFor="field-label">Question Label</Label>
          <Input
            id="field-label"
            value={localField.label}
            onChange={(e) => updateField({ label: e.target.value })}
            className="glass"
          />
        </div>

        {/* Field Placeholder */}
        {["text", "textarea", "email", "number"].includes(localField.type) && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder Text</Label>
            <Input
              id="field-placeholder"
              value={localField.placeholder || ""}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              className="glass"
            />
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required Field</Label>
          <Switch
            id="field-required"
            checked={localField.required}
            onCheckedChange={(required) => updateField({ required })}
          />
        </div>

        {/* Options for select, radio, checkbox */}
        {hasOptions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button variant="ghost" size="sm" onClick={addOption}>
                <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(localField.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="glass flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={(localField.options?.length || 0) <= 1}
                  >
                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Field */}
        <div className="pt-4 border-t border-border">
          <Button variant="destructive" size="sm" onClick={() => onDeleteField(localField.id)} className="w-full">
            <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4 h-4 mr-2" />
            Delete Field
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
