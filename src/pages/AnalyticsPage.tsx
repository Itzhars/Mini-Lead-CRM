import React, { useMemo } from "react"
import { BarChart3, TrendingUp, Users, Target, ArrowUpRight, CircleDollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLeads } from "@/features/leads/hooks/useLeads"

export const AnalyticsPage: React.FC = () => {
  const { data: leads = [], isLoading } = useLeads()

  // Calculate high-fidelity metrics from active mock database leads
  const metrics = useMemo(() => {
    const totalLeads = leads.length
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
    
    const statusCounts = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, CONVERTED: 0, LOST: 0 }
    const statusValues = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, CONVERTED: 0, LOST: 0 }
    const sourceCounts: Record<string, number> = {}

    leads.forEach((l) => {
      if (l.status in statusCounts) {
        statusCounts[l.status as keyof typeof statusCounts]++
        statusValues[l.status as keyof typeof statusValues] += l.value || 0
      }
      
      const src = l.source || "Unknown"
      sourceCounts[src] = (sourceCounts[src] || 0) + 1
    })

    const conversionRate = totalLeads > 0 
      ? ((statusCounts.CONVERTED / totalLeads) * 100).toFixed(1) 
      : "0"

    const avgDealSize = totalLeads > 0 
      ? Math.round(totalValue / totalLeads) 
      : 0

    return {
      totalLeads,
      totalValue,
      statusCounts,
      statusValues,
      sourceCounts,
      conversionRate,
      avgDealSize
    }
  }, [leads])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics Dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics, conversion analysis, and funnel performance tracking.
        </p>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Deal Pipeline
              </span>
              <h3 className="text-3xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
                ${metrics.totalValue.toLocaleString()}
              </h3>
              <p className="text-[10px] text-emerald-500 font-medium mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                +14.8% from last month
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
              <CircleDollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Conversion Funnel
              </span>
              <h3 className="text-3xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
                {metrics.conversionRate}%
              </h3>
              <p className="text-[10px] text-emerald-500 font-medium mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                +2.4% conversion velocity
              </p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Target className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Average Deal Size
              </span>
              <h3 className="text-3xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
                ${metrics.avgDealSize.toLocaleString()}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Based on active database lead values</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Inbound Leads
              </span>
              <h3 className="text-3xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
                {metrics.totalLeads}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Leads processed across database</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-600 dark:text-amber-400">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Visual Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stage distribution bar chart */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Pipeline Stage Distribution</CardTitle>
            <CardDescription>Visual summary of prospect counts per pipeline stage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {Object.entries(metrics.statusCounts).map(([status, count]) => {
              const percentage = metrics.totalLeads > 0 
                ? (count / metrics.totalLeads) * 100 
                : 0
              
              let barColor = "bg-primary"
              if (status === "CONVERTED") barColor = "bg-emerald-500"
              if (status === "LOST") barColor = "bg-rose-500"
              if (status === "QUALIFIED") barColor = "bg-blue-500"
              if (status === "CONTACTED") barColor = "bg-amber-500"

              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{status}</span>
                    <span className="font-medium text-slate-500">{count} Leads ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden">
                    <div 
                      className={`${barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Source breakdown chart */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Marketing Source Performance</CardTitle>
            <CardDescription>Top ingestion sources driving prospect generations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {Object.entries(metrics.sourceCounts).map(([source, count]) => {
              const percentage = metrics.totalLeads > 0 
                ? (count / metrics.totalLeads) * 100 
                : 0

              return (
                <div key={source} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{source}</span>
                    <span className="font-medium text-slate-500">{count} Leads ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 dark:bg-indigo-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {Object.keys(metrics.sourceCounts).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-12">No source details logged.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
