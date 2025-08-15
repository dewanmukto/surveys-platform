"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import type { Form, FormResponse } from "@/lib/forms"

interface ResponseTableProps {
  form: Form
  responses: FormResponse[]
  onViewResponse: (response: FormResponse) => void
  onExportCSV: () => void
}

export function ResponseTable({ form, responses, onViewResponse, onExportCSV }: ResponseTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("submittedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredResponses = responses.filter((response) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      response.id.toLowerCase().includes(searchLower) ||
      Object.values(response.responses).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchLower)
        }
        if (Array.isArray(value)) {
          return value.some((v) => String(v).toLowerCase().includes(searchLower))
        }
        return String(value).toLowerCase().includes(searchLower)
      })
    )
  })

  const sortedResponses = [...filteredResponses].sort((a, b) => {
    let aValue: any
    let bValue: any

    if (sortField === "submittedAt") {
      aValue = new Date(a.submittedAt).getTime()
      bValue = new Date(b.submittedAt).getTime()
    } else {
      aValue = a.responses[sortField] || ""
      bValue = b.responses[sortField] || ""
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    if (value instanceof File) {
      return value.name
    }
    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "..."
    }
    return String(value || "")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (responses.length === 0) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-heading font-bold">Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Icon icon="solar:chart-square-bold-duotone" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">No responses yet</h3>
            <p className="text-muted-foreground">Responses will appear here once people start filling out your form.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading font-bold">Responses ({responses.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onExportCSV}>
              <Icon icon="solar:download-bold-duotone" className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Icon icon="solar:sort-bold-duotone" className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass">
              <DropdownMenuItem
                onClick={() => {
                  setSortField("submittedAt")
                  setSortDirection("desc")
                }}
              >
                <Icon icon="solar:calendar-bold-duotone" className="w-4 h-4 mr-2" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("submittedAt")
                  setSortDirection("asc")
                }}
              >
                <Icon icon="solar:calendar-bold-duotone" className="w-4 h-4 mr-2" />
                Oldest First
              </DropdownMenuItem>
              {form.fields.slice(0, 3).map((field) => (
                <DropdownMenuItem
                  key={field.id}
                  onClick={() => {
                    setSortField(field.id)
                    setSortDirection("asc")
                  }}
                >
                  <Icon icon="solar:text-field-bold-duotone" className="w-4 h-4 mr-2" />
                  Sort by {field.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Responses Table */}
        <div className="space-y-4">
          {sortedResponses.map((response) => (
            <div
              key={response.id}
              className="p-4 border border-border rounded-lg glass bg-card/50 hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => onViewResponse(response)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {response.id}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(response.submittedAt)}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Icon icon="solar:eye-bold-duotone" className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {form.fields.slice(0, 6).map((field) => (
                  <div key={field.id} className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
                    <p className="text-sm">{formatValue(response.responses[field.id])}</p>
                  </div>
                ))}
              </div>

              {form.fields.length > 6 && (
                <p className="text-xs text-muted-foreground mt-3">+{form.fields.length - 6} more fields</p>
              )}
            </div>
          ))}
        </div>

        {filteredResponses.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <Icon icon="solar:magnifer-bold-duotone" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No responses match your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
