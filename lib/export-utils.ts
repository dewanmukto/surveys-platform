import type { Form, FormResponse } from "./forms"

export function exportToCSV(form: Form, responses: FormResponse[]): string {
  if (responses.length === 0) {
    return "No responses to export"
  }

  // Create headers
  const headers = ["Response ID", "Submitted At", ...form.fields.map((field) => field.label)]

  // Create rows
  const rows = responses.map((response) => {
    const row = [
      response.id,
      new Date(response.submittedAt).toLocaleString(),
      ...form.fields.map((field) => {
        const value = response.responses[field.id]
        if (Array.isArray(value)) {
          return value.join("; ")
        }
        if (value instanceof File) {
          return value.name
        }
        return value || ""
      }),
    ]
    return row
  })

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")

  return csvContent
}

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getFormAnalytics(form: Form, responses: FormResponse[]) {
  const analytics = {
    totalResponses: responses.length,
    averageCompletionTime: 0, // Would need timestamps to calculate
    responseRate: 0, // Would need view count to calculate
    fieldAnalytics: form.fields.map((field) => {
      const fieldResponses = responses
        .map((r) => r.responses[field.id])
        .filter((v) => v !== undefined && v !== null && v !== "")

      const analytics: any = {
        fieldId: field.id,
        fieldLabel: field.label,
        fieldType: field.type,
        responseCount: fieldResponses.length,
        responseRate: responses.length > 0 ? (fieldResponses.length / responses.length) * 100 : 0,
      }

      switch (field.type) {
        case "select":
        case "radio":
          const optionCounts =
            field.options?.reduce(
              (acc, option) => {
                acc[option] = fieldResponses.filter((r) => r === option).length
                return acc
              },
              {} as Record<string, number>,
            ) || {}
          analytics.optionCounts = optionCounts
          break

        case "checkbox":
          const checkboxCounts =
            field.options?.reduce(
              (acc, option) => {
                acc[option] = fieldResponses.filter((r) => Array.isArray(r) && r.includes(option)).length
                return acc
              },
              {} as Record<string, number>,
            ) || {}
          analytics.optionCounts = checkboxCounts
          break

        case "number":
          const numbers = fieldResponses.filter((r) => !isNaN(Number(r))).map(Number)
          if (numbers.length > 0) {
            analytics.average = numbers.reduce((a, b) => a + b, 0) / numbers.length
            analytics.min = Math.min(...numbers)
            analytics.max = Math.max(...numbers)
          }
          break

        case "text":
        case "textarea":
        case "email":
          const textResponses = fieldResponses.filter((r) => typeof r === "string")
          analytics.averageLength =
            textResponses.length > 0 ? textResponses.reduce((acc, r) => acc + r.length, 0) / textResponses.length : 0
          break
      }

      return analytics
    }),
  }

  return analytics
}
