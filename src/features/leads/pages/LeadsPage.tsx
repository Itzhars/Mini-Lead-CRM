import React, { useMemo, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Plus, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLeads, useDeleteLead } from "../hooks/useLeads"
import { SearchFilterBar } from "../components/SearchFilterBar"
import { LeadTable } from "../components/LeadTable"
import { TableSkeleton } from "../components/LeadSkeletons"
import { EmptyState } from "../components/EmptyState"
import { ErrorState } from "../components/ErrorState"
import { DeleteLeadDialog } from "../components/DeleteLeadDialog"

export const LeadsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const statusFilter = searchParams.get("status") || "ALL"

  // Local state to track which lead is queued for deletion confirmation modal
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Fetch leads and delete mutations
  const { data: leads, isLoading, isError, error, refetch } = useLeads()
  const { mutate: deleteLead } = useDeleteLead()

  // Apply filters locally for instant frontend speed & JSON server compatibility
  const filteredLeads = useMemo(() => {
    if (!leads) return []
    return leads.filter((lead) => {
      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase()
      const search = searchQuery.toLowerCase().trim()
      
      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        (lead.company && lead.company.toLowerCase().includes(search))

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [leads, searchQuery, statusFilter])

  const targetLeadForDeletion = useMemo(() => {
    return leads?.find((l) => l.id === deleteId)
  }, [leads, deleteId])

  const handleClearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("search")
      prev.delete("status")
      return prev
    })
  }

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteLead(deleteId)
      setDeleteId(null)
    }
  }

  const isFiltered = !!(searchQuery || statusFilter !== "ALL")

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Leads Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Analyze, filter, and modify prospect entries across your active pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" asChild className="text-xs h-9 hidden xs:flex">
            <Link to="/board" className="flex items-center gap-1.5">
              Pipeline Board
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2 shadow-sm text-xs h-9">
            <Link to="/leads/new">
              <Plus className="h-4 w-4" />
              Add New Lead
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and control panel */}
      <SearchFilterBar />

      {/* Primary table and list state toggling */}
      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState
          message={error?.message || "Could not retrieve leads from JSON-server database. Make sure localhost:3001 is active."}
          onRetry={refetch}
        />
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          title={isFiltered ? "No prospects match your criteria" : "Prospect database is currently empty"}
          description={
            isFiltered
              ? "Try adjusting your text search queries or resetting status selectors."
              : "Get started by adding a brand new lead record to the CRM pipeline."
          }
          isSearchClearable={isFiltered}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing <strong>{filteredLeads.length}</strong> of <strong>{leads?.length}</strong> registered leads
            </span>
          </div>
          <LeadTable leads={filteredLeads} onDelete={(id) => setDeleteId(id)} />
        </div>
      )}

      {/* Confirm Deletion accessible dialog modal */}
      <DeleteLeadDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        leadName={
          targetLeadForDeletion
            ? `${targetLeadForDeletion.firstName} ${targetLeadForDeletion.lastName}`
            : "Prospect"
        }
      />
    </div>
  )
}

export default LeadsPage
