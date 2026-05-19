import React from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadForm } from "../components/LeadForm"
import { useLead, useUpdateLead } from "../hooks/useLeads"
import { TableSkeleton } from "../components/LeadSkeletons"
import { ErrorState } from "../components/ErrorState"
import type { LeadFormData } from "../schemas/lead.schema"

export const EditLeadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <ErrorState message="Prospect ID is missing from the URL routing context." />
  }

  // Load target lead profile and mutation trigger
  const { data: lead, isLoading, isError, error, refetch } = useLead(id)
  const { mutateAsync: updateLead, isPending } = useUpdateLead()

  const handleSubmit = async (data: LeadFormData) => {
    try {
      await updateLead({ id, data })
      navigate(`/leads/${id}`)
    } catch {
      // Errors handled gracefully by global Sonner alert in useUpdateLead hook
    }
  }

  const defaultValues = lead
    ? {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone || "",
        company: lead.company,
        value: lead.value,
        status: lead.status,
        source: lead.source || "",
        notes: lead.notes || "",
      }
    : undefined

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
          <Link to={`/leads/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Modify Lead</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Update properties for lead prospect ID: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{id}</code>
          </p>
        </div>
      </div>

      {/* Conditional forms rendering based on async fetch states */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Retrieving dossier records...</span>
          </div>
          <TableSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          message={error?.message || "Failed to retrieve the specific prospect dossier details from the database."}
          onRetry={refetch}
        />
      ) : defaultValues ? (
        <LeadForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Save Changes"
        />
      ) : null}
    </div>
  )
}

export default EditLeadPage
