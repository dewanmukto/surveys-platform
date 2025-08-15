"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Icon } from "@iconify/react"
import type { Form, FormResponse } from "@/lib/forms"
import { getFormAnalytics } from "@/lib/export-utils"

interface AnalyticsChartsProps {
  form: Form
  responses: FormResponse[]
}

export function AnalyticsCharts({ form, responses }: AnalyticsChartsProps) {
  const analytics = getFormAnalytics(form, responses)

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case "text":
        return "solar:text-field-bold-duotone"
      case "textarea":
        return "solar:text-square-bold-duotone"
      case "email":
        return "solar:letter-bold-duotone"
      case "number":
        return "solar:calculator-bold-duotone"
      case "select":
        return "solar:list-arrow-down-bold-duotone"
      case "radio":
        return "solar:record-circle-bold-duotone"
      case "checkbox":
        return "solar:check-square-bold-duotone"
      case "date":
        return "solar:calendar-bold-duotone"
      case "file":
        return "solar:upload-bold-duotone"
      default:
        return "solar:widget-add-bold-duotone"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
            <Icon icon="solar:chart-square-bold-duotone" className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold">{analytics.totalResponses}</div>
            <p className="text-xs text-muted-foreground">Responses collected</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Form Fields</CardTitle>
            <Icon icon="solar:widget-add-bold-duotone" className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold">{form.fields.length}</div>
            <p className="text-xs text-muted-foreground">Questions in form</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <Icon icon="solar:check-circle-bold-duotone" className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold">{analytics.totalResponses > 0 ? "100%" : "0%"}</div>
            <p className="text-xs text-muted-foreground">Forms completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Field Analytics */}
      {analytics.fieldAnalytics.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-heading font-bold">Field Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analytics.fieldAnalytics.map((fieldAnalytic) => (
              <div key={fieldAnalytic.fieldId} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon icon={getFieldIcon(fieldAnalytic.fieldType)} className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">{fieldAnalytic.fieldLabel}</h4>
                    <p className="text-sm text-muted-foreground">
                      {fieldAnalytic.responseCount} responses ({fieldAnalytic.responseRate.toFixed(1)}% response rate)
                    </p>
                  </div>
                </div>

                <Progress value={fieldAnalytic.responseRate} className="h-2" />

                {/* Option counts for select/radio/checkbox */}
                {fieldAnalytic.optionCounts && (
                  <div className="ml-8 space-y-2">
                    {Object.entries(fieldAnalytic.optionCounts).map(([option, count]) => (
                      <div key={option} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{option}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{count}</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${analytics.totalResponses > 0 ? (count / analytics.totalResponses) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Number field statistics */}
                {fieldAnalytic.average !== undefined && (
                  <div className="ml-8 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Average</p>
                      <p className="font-medium">{fieldAnalytic.average.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min</p>
                      <p className="font-medium">{fieldAnalytic.min}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max</p>
                      <p className="font-medium">{fieldAnalytic.max}</p>
                    </div>
                  </div>
                )}

                {/* Text field statistics */}
                {fieldAnalytic.averageLength !== undefined && (
                  <div className="ml-8 text-sm">
                    <p className="text-muted-foreground">Average response length</p>
                    <p className="font-medium">{fieldAnalytic.averageLength.toFixed(0)} characters</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
