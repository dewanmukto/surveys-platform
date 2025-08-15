"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { FIELD_TYPES, createDefaultField } from "./field-types"
import type { FormField } from "@/lib/forms"

interface FieldPaletteProps {
  onAddField: (field: FormField) => void
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  const handleAddField = (type: FormField["type"]) => {
    const newField = createDefaultField(type)
    onAddField(newField)
  }

  return (
    <Card className="glass h-fit">
      <CardHeader>
        <CardTitle className="font-heading font-bold text-lg">Add Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {FIELD_TYPES.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="ghost"
            className="w-full justify-start h-auto p-3 glass bg-transparent hover:bg-primary/10"
            onClick={() => handleAddField(fieldType.type)}
          >
            <div className="flex items-center gap-3 w-full">
              <Icon icon={fieldType.icon} className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="font-medium text-sm">{fieldType.label}</div>
                <div className="text-xs text-muted-foreground">{fieldType.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
