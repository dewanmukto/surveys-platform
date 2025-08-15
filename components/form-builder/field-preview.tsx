"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@iconify/react"
import type { FormField } from "@/lib/forms"

interface FieldPreviewProps {
  field: FormField
  isSelected?: boolean
  onClick?: () => void
}

export function FieldPreview({ field, isSelected, onClick }: FieldPreviewProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
        return <Input placeholder={field.placeholder} className="glass" disabled />

      case "textarea":
        return <Textarea placeholder={field.placeholder} className="glass resize-none" rows={3} disabled />

      case "email":
        return <Input type="email" placeholder={field.placeholder} className="glass" disabled />

      case "number":
        return <Input type="number" placeholder={field.placeholder} className="glass" disabled />

      case "select":
        return (
          <Select disabled>
            <SelectTrigger className="glass">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup disabled>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-${index}`} disabled />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case "date":
        return <Input type="date" className="glass" disabled />

      case "file":
        return (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center glass">
            <Icon icon="solar:upload-bold-duotone" className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          </div>
        )

      default:
        return <Input placeholder="Unknown field type" className="glass" disabled />
    }
  }

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-border hover:border-primary/50 hover:bg-primary/2"
      } glass`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Icon
            icon="solar:settings-bold-duotone"
            className={`w-4 h-4 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground"}`}
          />
        </div>
        {renderField()}
      </div>
    </div>
  )
}
