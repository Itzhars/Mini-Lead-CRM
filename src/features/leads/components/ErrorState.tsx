import React from "react"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Failed to load lead prospects from the server database.",
  onRetry,
}) => {
  return (
    <div className="border border-rose-200 dark:border-rose-950/30 rounded-xl bg-rose-50/40 dark:bg-rose-950/10 p-8 py-14 text-center flex flex-col items-center justify-center space-y-4">
      <div className="bg-rose-100 dark:bg-rose-950/40 p-4 rounded-full text-rose-600 dark:text-rose-400">
        <AlertCircle className="h-10 w-10" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Connection Interrupted</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2 text-xs h-9 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400">
          <RotateCcw className="h-4 w-4" />
          Retry Request
        </Button>
      )}
    </div>
  )
}
