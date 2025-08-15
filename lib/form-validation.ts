import type { FormField } from "./forms"

export interface ValidationError {
  fieldId: string
  message: string
}

export function validateFormResponse(fields: FormField[], responses: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = []

  fields.forEach((field) => {
    const value = responses[field.id]

    // Check required fields
    if (field.required) {
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        errors.push({
          fieldId: field.id,
          message: "This field is required",
        })
        return
      }
    }

    // Skip validation if field is empty and not required
    if (!value && !field.required) return

    // Type-specific validation
    switch (field.type) {
      case "email":
        if (value && !isValidEmail(value)) {
          errors.push({
            fieldId: field.id,
            message: "Please enter a valid email address",
          })
        }
        break

      case "number":
        if (value && isNaN(Number(value))) {
          errors.push({
            fieldId: field.id,
            message: "Please enter a valid number",
          })
        }
        break

      case "select":
      case "radio":
        if (value && field.options && !field.options.includes(value)) {
          errors.push({
            fieldId: field.id,
            message: "Please select a valid option",
          })
        }
        break

      case "checkbox":
        if (value && Array.isArray(value) && field.options) {
          const invalidOptions = value.filter((v) => !field.options!.includes(v))
          if (invalidOptions.length > 0) {
            errors.push({
              fieldId: field.id,
              message: "Please select valid options",
            })
          }
        }
        break

      case "date":
        if (value && !isValidDate(value)) {
          errors.push({
            fieldId: field.id,
            message: "Please enter a valid date",
          })
        }
        break

      case "file":
        if (value && !(value instanceof File)) {
          errors.push({
            fieldId: field.id,
            message: "Please select a valid file",
          })
        }
        break
    }
  })

  return errors
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}
