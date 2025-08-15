import type { FormField } from "@/lib/forms"

export const FIELD_TYPES = [
  {
    type: "text" as const,
    label: "Short Text",
    icon: "solar:text-field-bold-duotone",
    description: "Single line text input",
  },
  {
    type: "textarea" as const,
    label: "Long Text",
    icon: "solar:text-square-bold-duotone",
    description: "Multi-line text area",
  },
  {
    type: "email" as const,
    label: "Email",
    icon: "solar:letter-bold-duotone",
    description: "Email address input",
  },
  {
    type: "number" as const,
    label: "Number",
    icon: "solar:calculator-bold-duotone",
    description: "Numeric input field",
  },
  {
    type: "select" as const,
    label: "Dropdown",
    icon: "solar:list-arrow-down-bold-duotone",
    description: "Single choice dropdown",
  },
  {
    type: "radio" as const,
    label: "Multiple Choice",
    icon: "solar:record-circle-bold-duotone",
    description: "Radio button selection",
  },
  {
    type: "checkbox" as const,
    label: "Checkboxes",
    icon: "solar:check-square-bold-duotone",
    description: "Multiple selections",
  },
  {
    type: "date" as const,
    label: "Date",
    icon: "solar:calendar-bold-duotone",
    description: "Date picker input",
  },
  {
    type: "file" as const,
    label: "File Upload",
    icon: "solar:upload-bold-duotone",
    description: "File attachment field",
  },
]

export function createDefaultField(type: FormField["type"]): FormField {
  const baseField: FormField = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    label: "",
    required: false,
  }

  switch (type) {
    case "text":
      return { ...baseField, label: "Short Text Question", placeholder: "Enter your answer" }
    case "textarea":
      return { ...baseField, label: "Long Text Question", placeholder: "Enter your detailed answer" }
    case "email":
      return { ...baseField, label: "Email Address", placeholder: "Enter your email" }
    case "number":
      return { ...baseField, label: "Number Question", placeholder: "Enter a number" }
    case "select":
      return { ...baseField, label: "Dropdown Question", options: ["Option 1", "Option 2", "Option 3"] }
    case "radio":
      return { ...baseField, label: "Multiple Choice Question", options: ["Option 1", "Option 2", "Option 3"] }
    case "checkbox":
      return { ...baseField, label: "Checkbox Question", options: ["Option 1", "Option 2", "Option 3"] }
    case "date":
      return { ...baseField, label: "Date Question" }
    case "file":
      return { ...baseField, label: "File Upload Question" }
    default:
      return baseField
  }
}
