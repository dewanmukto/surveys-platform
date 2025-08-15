export interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date" | "file"
  label: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  placeholder?: string
}

export interface Form {
  id: string
  title: string
  description: string
  fields: FormField[]
  createdAt: string
  updatedAt: string
  isPublished: boolean
  responseCount: number
  userId: string
}

export interface FormResponse {
  id: string
  formId: string
  responses: Record<string, any>
  submittedAt: string
  ipAddress?: string
}

// Simple in-memory storage for demo (in production, use proper database)
const forms: Form[] = []
const responses: FormResponse[] = []

export class FormsService {
  static async getUserForms(userId: string): Promise<Form[]> {
    return forms.filter((form) => form.userId === userId)
  }

  static async createForm(userId: string, title: string, description: string): Promise<Form> {
    const form: Form = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      responseCount: 0,
      userId,
    }

    forms.push(form)
    return form
  }

  static async updateForm(formId: string, updates: Partial<Form>): Promise<Form | null> {
    const formIndex = forms.findIndex((f) => f.id === formId)
    if (formIndex === -1) return null

    forms[formIndex] = { ...forms[formIndex], ...updates, updatedAt: new Date().toISOString() }
    return forms[formIndex]
  }

  static async deleteForm(formId: string): Promise<boolean> {
    const formIndex = forms.findIndex((f) => f.id === formId)
    if (formIndex === -1) return false

    forms.splice(formIndex, 1)
    // Also delete associated responses
    const responseIndices = responses.map((r, i) => (r.formId === formId ? i : -1)).filter((i) => i !== -1)
    responseIndices.reverse().forEach((i) => responses.splice(i, 1))

    return true
  }

  static async getForm(formId: string): Promise<Form | null> {
    return forms.find((f) => f.id === formId) || null
  }

  static async getFormResponses(formId: string): Promise<FormResponse[]> {
    return responses.filter((r) => r.formId === formId)
  }

  static async submitResponse(formId: string, responseData: Record<string, any>): Promise<FormResponse> {
    const response: FormResponse = {
      id: Math.random().toString(36).substr(2, 9),
      formId,
      responses: responseData,
      submittedAt: new Date().toISOString(),
    }

    responses.push(response)

    // Update form response count
    const form = forms.find((f) => f.id === formId)
    if (form) {
      form.responseCount++
    }

    return response
  }

  static async getDashboardStats(userId: string): Promise<{
    totalForms: number
    totalResponses: number
    publishedForms: number
    recentActivity: Array<{ type: string; message: string; timestamp: string }>
  }> {
    const userForms = forms.filter((f) => f.userId === userId)
    const totalResponses = userForms.reduce((sum, form) => sum + form.responseCount, 0)
    const publishedForms = userForms.filter((f) => f.isPublished).length

    // Generate some recent activity
    const recentActivity = [
      { type: "form_created", message: "New form created", timestamp: new Date().toISOString() },
      { type: "response_received", message: "New response received", timestamp: new Date().toISOString() },
    ]

    return {
      totalForms: userForms.length,
      totalResponses,
      publishedForms,
      recentActivity,
    }
  }
}
