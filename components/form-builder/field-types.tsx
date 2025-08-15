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
    type: "url" as const,
    label: "URL",
    icon: "solar:link-bold-duotone",
    description: "Website URL input",
  },
  {
    type: "phone" as const,
    label: "Phone",
    icon: "solar:phone-bold-duotone",
    description: "Phone number input",
  },
  {
    type: "number" as const,
    label: "Number",
    icon: "solar:calculator-bold-duotone",
    description: "Numeric input field",
  },
  {
    type: "rating" as const,
    label: "Rating",
    icon: "solar:star-bold-duotone",
    description: "Star rating selection",
  },
  {
    type: "scale" as const,
    label: "Linear Scale",
    icon: "solar:slider-horizontal-bold-duotone",
    description: "Scale from 1 to 10",
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
    type: "matrix" as const,
    label: "Multiple Choice Grid",
    icon: "solar:grid-bold-duotone",
    description: "Grid of choices",
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
  {
    type: "section" as const,
    label: "Section Break",
    icon: "solar:text-bold-duotone",
    description: "Add section title and description",
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
    case "url":
      return { ...baseField, label: "Website URL", placeholder: "https://example.com" }
    case "phone":
      return { ...baseField, label: "Phone Number", placeholder: "Enter your phone number" }
    case "number":
      return { ...baseField, label: "Number Question", placeholder: "Enter a number" }
    case "rating":
      return { ...baseField, label: "Rating Question", settings: { maxRating: 5 } }
    case "scale":
      return { ...baseField, label: "Scale Question", settings: { minValue: 1, maxValue: 10, minLabel: "Not likely", maxLabel: "Very likely" } }
    case "select":
      return { ...baseField, label: "Dropdown Question", options: ["Option 1", "Option 2", "Option 3"] }
    case "radio":
      return { ...baseField, label: "Multiple Choice Question", options: ["Option 1", "Option 2", "Option 3"] }
    case "checkbox":
      return { ...baseField, label: "Checkbox Question", options: ["Option 1", "Option 2", "Option 3"] }
    case "matrix":
      return { ...baseField, label: "Matrix Question", options: ["Row 1", "Row 2"], settings: { columns: ["Column 1", "Column 2"] } }
    case "date":
      return { ...baseField, label: "Date Question" }
    case "file":
      return { ...baseField, label: "File Upload Question" }
    case "section":
      return { ...baseField, label: "Section Title", description: "Section description", required: false }
    default:
      return baseField
  }
}
