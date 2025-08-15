"use client"

import { Component, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
          <Card className="glass max-w-md w-full text-center">
            <CardHeader>
              <Icon icon="solar:danger-triangle-bold-duotone" className="w-16 h-16 text-destructive mx-auto mb-4" />
              <CardTitle className="font-heading font-bold text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem
                persists.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => window.location.reload()} className="flex-1">
                  <Icon icon="solar:refresh-bold-duotone" className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex-1">
                  <Icon icon="solar:home-bold-duotone" className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left mt-4 p-3 bg-muted/30 rounded-lg text-xs">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
