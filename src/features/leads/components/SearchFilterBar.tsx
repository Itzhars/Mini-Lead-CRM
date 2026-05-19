import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LEAD_STATUS } from "../types/lead.types"

export const SearchFilterBar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const statusFilter = searchParams.get("status") || "ALL"

  // Local state for instant feedback on typing
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Synchronize local input state if search param is altered elsewhere
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  // Debounced search setter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParams(
        (prev) => {
          if (localSearch.trim()) {
            prev.set("search", localSearch.trim())
          } else {
            prev.delete("search")
          }
          return prev
        },
        { replace: true }
      )
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localSearch, setSearchParams])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSearchParams((prev) => {
      if (value && value !== "ALL") {
        prev.set("status", value)
      } else {
        prev.delete("status")
      }
      return prev
    })
  }

  const handleClearFilters = () => {
    setLocalSearch("")
    setSearchParams((prev) => {
      prev.delete("search")
      prev.delete("status")
      return prev
    })
  }

  const isFiltered = searchQuery || statusFilter !== "ALL"

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search prospects by name or email..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 pr-9 text-sm h-10 w-full bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="flex h-10 w-full sm:w-48 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Statuses</option>
          {Object.values(LEAD_STATUS).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  )
}
