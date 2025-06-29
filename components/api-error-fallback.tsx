"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ApiErrorFallbackProps {
  error?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ApiErrorFallback({
  error = "Unable to connect to server",
  onRetry,
  showRetry = true,
}: ApiErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <CardTitle>Connection Error</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">{error}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Please check:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your internet connection</li>
            <li>Server availability</li>
            <li>API endpoint configuration</li>
          </ul>
        </div>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
