import { supabase } from './supabase'
import type { Database } from './supabase'

export interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date" | "file" | "url" | "phone" | "rating" | "scale" | "matrix" | "section"
  label: string
  required: boolean
  options?: string[]
  placeholder?: string
  description?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  settings?: Record<string, any>
}

export interface Form {
  id: string
  user_id: string
  title: string
  description: string
  fields: FormField[]
  settings: Record<string, any>
  is_published: boolean
  created_at: string
  updated_at: string
  response_count?: number
}

export interface FormResponse {
  id: string
  form_id: string
  responses: Record<string, any>
  ip_address?: string
  user_agent?: string
  submitted_at: string
}

export class FormsService {
  static async getUserForms(userId: string): Promise<Form[]> {
    const { data, error } = await supabase
      .from('forms')
      .select(`
        *,
        form_responses(count)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return data.map(form => ({
      ...form,
      response_count: form.form_responses?.[0]?.count || 0
    }))
  }

  static async createForm(userId: string, title: string, description: string): Promise<Form> {
    const { data, error } = await supabase
      .from('forms')
      .insert({
        user_id: userId,
        title,
        description,
        fields: [],
        settings: {}
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateForm(formId: string, updates: Partial<Form>): Promise<Form | null> {
    const { data, error } = await supabase
      .from('forms')
      .update(updates)
      .eq('id', formId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteForm(formId: string): Promise<boolean> {
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId)

    return !error
  }

  static async getForm(formId: string): Promise<Form | null> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single()

    if (error) return null
    return data
  }

  static async getPublicForm(formId: string): Promise<Form | null> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('is_published', true)
      .single()

    if (error) return null
    return data
  }

  static async getFormResponses(formId: string): Promise<FormResponse[]> {
    const { data, error } = await supabase
      .from('form_responses')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async submitResponse(formId: string, responseData: Record<string, any>, metadata?: { ip_address?: string, user_agent?: string }): Promise<FormResponse> {
    const { data, error } = await supabase
      .from('form_responses')
      .insert({
        form_id: formId,
        responses: responseData,
        ip_address: metadata?.ip_address,
        user_agent: metadata?.user_agent
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getDashboardStats(userId: string): Promise<{
    totalForms: number
    totalResponses: number
    publishedForms: number
    recentActivity: Array<{ type: string; message: string; timestamp: string }>
  }> {
    // Get forms count
    const { count: totalForms } = await supabase
      .from('forms')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get published forms count
    const { count: publishedForms } = await supabase
      .from('forms')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_published', true)

    // Get total responses count
    const { count: totalResponses } = await supabase
      .from('form_responses')
      .select('*, forms!inner(*)', { count: 'exact', head: true })
      .eq('forms.user_id', userId)

    // Get recent activity
    const { data: recentForms } = await supabase
      .from('forms')
      .select('title, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5)

    const recentActivity = recentForms?.map(form => ({
      type: 'form_updated',
      message: `Form "${form.title}" was updated`,
      timestamp: form.updated_at
    })) || []

    return {
      totalForms: totalForms || 0,
      totalResponses: totalResponses || 0,
      publishedForms: publishedForms || 0,
      recentActivity
    }
  }

  static async duplicateForm(formId: string, userId: string): Promise<Form> {
    const originalForm = await this.getForm(formId)
    if (!originalForm) throw new Error('Form not found')

    const { data, error } = await supabase
      .from('forms')
      .insert({
        user_id: userId,
        title: `${originalForm.title} (Copy)`,
        description: originalForm.description,
        fields: originalForm.fields,
        settings: originalForm.settings,
        is_published: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
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
