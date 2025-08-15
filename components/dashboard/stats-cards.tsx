import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@iconify/react"

interface StatsCardsProps {
  totalForms: number
  totalResponses: number
  publishedForms: number
}

export function StatsCards({ totalForms, totalResponses, publishedForms }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Forms</CardTitle>
          <Icon icon="solar:document-text-bold-duotone" className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-heading font-bold">{totalForms}</div>
          <p className="text-xs text-muted-foreground">Forms created</p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
          <Icon icon="solar:chart-square-bold-duotone" className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-heading font-bold">{totalResponses}</div>
          <p className="text-xs text-muted-foreground">Responses collected</p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Published Forms</CardTitle>
          <Icon icon="solar:eye-bold-duotone" className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-heading font-bold">{publishedForms}</div>
          <p className="text-xs text-muted-foreground">Live forms</p>
        </CardContent>
      </Card>
    </div>
  )
}
