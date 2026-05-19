import React from "react"
import { Inbox, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  isSearchClearable?: boolean
  onClearFilters?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No prospects found",
  description = "Start building your pipeline by adding a new lead record to the CRM.",
  isSearchClearable = false,
  onClearFilters,
}) => {
  return (
    <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm p-8 py-14 text-center flex flex-col items-center justify-center space-y-4">
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-full text-slate-400 dark:text-slate-500">
        <Inbox className="h-10 w-10" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {isSearchClearable && onClearFilters && (
        <Button variant="outline" onClick={onClearFilters} className="gap-2 text-xs h-9">
          <XCircle className="h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  )
}
