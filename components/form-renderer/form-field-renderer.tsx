"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import type { FormField } from "@/lib/forms"

interface FormFieldRendererProps {
  field: FormField
  value: any
  onChange: (value: any) => void
  error?: string
}

export function FormFieldRenderer({ field, value, onChange, error }: FormFieldRendererProps) {
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onChange(file)
    }
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`glass ${error ? "border-destructive" : ""}`}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`glass resize-none ${error ? "border-destructive" : ""}`}
            rows={4}
          />
        )

      case "email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`glass ${error ? "border-destructive" : ""}`}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`glass ${error ? "border-destructive" : ""}`}
          />
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={`glass ${error ? "border-destructive" : ""}`}>
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent className="glass">
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
          <RadioGroup value={value || ""} onValueChange={onChange} className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || []
                    if (checked) {
                      onChange([...currentValues, option])
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option))
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`glass ${error ? "border-destructive" : ""}`}
          />
        )

      case "file":
        return (
          <div className="space-y-2">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center glass transition-colors ${
                error ? "border-destructive" : "border-border hover:border-primary/50"
              }`}
            >
              <input type="file" id={field.id} className="hidden" onChange={handleFileChange} accept="*/*" />
              <Label htmlFor={field.id} className="cursor-pointer">
                <Icon icon="solar:upload-bold-duotone" className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  {fileName ? fileName : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">Any file type accepted</p>
              </Label>
            </div>
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon icon="solar:document-bold-duotone" className="w-4 h-4" />
                <span>{fileName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFileName("")
                    onChange(null)
                  }}
                >
                  <Icon icon="solar:close-circle-bold-duotone" className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="p-4 border border-destructive rounded-lg text-center">
            <p className="text-sm text-destructive">Unsupported field type: {field.type}</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <Icon icon="solar:danger-circle-bold-duotone" className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
