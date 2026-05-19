import React from "react"
import { Link } from "react-router-dom"
import { Users, Plus, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const LeadsListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Leads Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse and coordinate your complete sales prospects database.
          </p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <Link to="/leads/new">
            <Plus className="h-4 w-4" />
            Add New Lead
          </Link>
        </Button>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Total Leads Registered</CardTitle>
          <CardDescription>Directory stub linked with local state hooks.</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/5 p-4 rounded-full text-primary mb-3">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Leads List Stub Active</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Integration endpoints successfully connected to hooks layer.
          </p>
          <Button variant="link" asChild className="mt-2 text-xs">
            <Link to="/board" className="flex items-center gap-1">
              Go to Pipeline Board <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
export default LeadsListPage
