import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
  Users,
  Award,
  TrendingUp,
  Percent,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StatCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  comparisonLabel: string
  icon: React.ComponentType<{ className?: string }>
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, comparisonLabel, icon: Icon }) => (
  <Card className="hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-800">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 bg-primary/5 dark:bg-primary/10 rounded-xl text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2.5">
        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{comparisonLabel}</p>
    </CardContent>
  </Card>
)

type RangeType = "7_days" | "30_days" | "90_days" | "all_time"

export const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<RangeType>("30_days")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Listen for outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const rangeLabels: Record<RangeType, string> = {
    "7_days": "Last 7 Days",
    "30_days": "Last 30 Days",
    "90_days": "Last 90 Days",
    "all_time": "All Time",
  }

  // Dynamic metrics stats based on time selections
  const stats = {
    "7_days": [
      { title: "Total Leads", value: "284", change: "5.4%", isPositive: true, comparisonLabel: "vs. previous 7 days", icon: Users },
      { title: "Qualified Deals", value: "64", change: "1.8%", isPositive: true, comparisonLabel: "vs. previous 7 days", icon: Award },
      { title: "Conversion Rate", value: "22.5%", change: "0.5%", isPositive: true, comparisonLabel: "vs. previous 7 days", icon: Percent },
      { title: "Monthly Revenue", value: "$11,240", change: "12.4%", isPositive: true, comparisonLabel: "vs. previous 7 days", icon: TrendingUp },
    ],
    "30_days": [
      { title: "Total Leads", value: "1,482", change: "12.5%", isPositive: true, comparisonLabel: "vs. previous 30 days", icon: Users },
      { title: "Qualified Deals", value: "342", change: "8.2%", isPositive: true, comparisonLabel: "vs. previous 30 days", icon: Award },
      { title: "Conversion Rate", value: "23.4%", change: "-1.8%", isPositive: false, comparisonLabel: "vs. previous 30 days", icon: Percent },
      { title: "Monthly Revenue", value: "$45,820", change: "18.9%", isPositive: true, comparisonLabel: "vs. previous 30 days", icon: TrendingUp },
    ],
    "90_days": [
      { title: "Total Leads", value: "4,392", change: "14.2%", isPositive: true, comparisonLabel: "vs. previous 90 days", icon: Users },
      { title: "Qualified Deals", value: "984", change: "11.5%", isPositive: true, comparisonLabel: "vs. previous 90 days", icon: Award },
      { title: "Conversion Rate", value: "22.4%", change: "-0.4%", isPositive: false, comparisonLabel: "vs. previous 90 days", icon: Percent },
      { title: "Monthly Revenue", value: "$134,850", change: "15.2%", isPositive: true, comparisonLabel: "vs. previous 90 days", icon: TrendingUp },
    ],
    "all_time": [
      { title: "Total Leads", value: "12,850", change: "28.4%", isPositive: true, comparisonLabel: "vs. previous year", icon: Users },
      { title: "Qualified Deals", value: "2,840", change: "24.1%", isPositive: true, comparisonLabel: "vs. previous year", icon: Award },
      { title: "Conversion Rate", value: "22.1%", change: "1.2%", isPositive: true, comparisonLabel: "vs. previous year", icon: Percent },
      { title: "Monthly Revenue", value: "$384,200", change: "32.8%", isPositive: true, comparisonLabel: "vs. previous year", icon: TrendingUp },
    ],
  }

  const activeStats = stats[dateRange]

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time visual monitoring of pipeline performance and lead engagement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Fully Functional Date Range Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              className="gap-2 rounded-xl transition-all duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Calendar className="h-4 w-4 text-primary" />
              {rangeLabels[dateRange]}
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                {(Object.keys(rangeLabels) as RangeType[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range)
                      setDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left transition-all ${
                      dateRange === range
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {rangeLabels[range]}
                    {dateRange === range && <div className="h-1.5 w-1.5 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button className="gap-2 shadow-sm rounded-xl" asChild>
            <Link to="/leads/new">
              <Plus className="h-4 w-4" />
              Add New Lead
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeStats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            change={item.change}
            isPositive={item.isPositive}
            comparisonLabel={item.comparisonLabel}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Main split grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 cols: Leads Funnel or visual lists */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads Pipeline</CardTitle>
              <CardDescription>Recent inbound contacts requiring qualification steps.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" aria-label="More options">
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400">Lead Name</th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400">Company</th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400">Stage</th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400">Value</th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { name: "Sophia Martinez", company: "AeroTech Solutions", stage: "In Contact", value: "$4,500", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
                    { name: "David Vance", company: "OmniCorp Global", stage: "Qualified", value: "$12,800", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
                    { name: "Elena Rostova", company: "CyberShield Security", stage: "Proposal Sent", value: "$9,200", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
                    { name: "Marcus Brody", company: "Apex Systems", stage: "Lead / Cold", value: "$2,400", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
                  ].map((lead, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors duration-150">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{lead.name}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{lead.company}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${lead.color}`}>
                          {lead.stage}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{lead.value}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/leads">Manage</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 col: Lead activity feed */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>System Activity Feed</CardTitle>
            <CardDescription>Latest events recorded across user portfolios.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { time: "10 mins ago", event: "Sophia Martinez was moved to 'In Contact'", desc: "by Harsh Vardhan", icon: Users, color: "bg-amber-500" },
                { time: "2 hours ago", event: "David Vance proposal accepted", desc: "System updated pipeline value to $12,800", icon: Award, color: "bg-emerald-500" },
                { time: "5 hours ago", event: "New lead record generated", desc: "Elena Rostova via Webhook Ingestion", icon: Plus, color: "bg-primary" },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`mt-1 p-2 rounded-lg text-white ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{activity.time}</h4>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{activity.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
