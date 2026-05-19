import React, { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Tag,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLead, useDeleteLead } from "../hooks/useLeads"
import { TableSkeleton } from "../components/LeadSkeletons"
import { ErrorState } from "../components/ErrorState"
import { StatusActions } from "../components/StatusActions"
import { DeleteLeadDialog } from "../components/DeleteLeadDialog"

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <ErrorState message="Prospect ID is missing from the URL routing context." />
  }

  // Fetch lead profile detail and delete mutation
  const { data: lead, isLoading, isError, error, refetch } = useLead(id)
  const { mutate: deleteLead } = useDeleteLead()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "N/A"
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)
  }

  const formatFullDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    } catch {
      return "N/A"
    }
  }

  const handleDeleteConfirm = () => {
    deleteLead(id)
    setIsDeleteOpen(false)
    navigate("/leads")
  }

  return (
    <div className="space-y-6">
      {/* Header / Actions section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link to="/leads">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Prospect Dossier</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Detailed analytical view for pipeline prospect.
            </p>
          </div>
        </div>

        {lead && (
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" asChild className="gap-2 text-xs h-9">
              <Link to={`/leads/${id}/edit`}>
                <Edit className="h-4 w-4" />
                Modify Record
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-2 text-xs h-9"
            >
              <Trash2 className="h-4 w-4" />
              Delete Lead
            </Button>
          </div>
        )}
      </div>

      {/* Main details body rendering based on fetching states */}
      {isLoading ? (
        <div className="space-y-4">
          <TableSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          message={error?.message || "Failed to load lead details."}
          onRetry={refetch}
        />
      ) : lead ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Core Dossier Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-550 to-slate-650 dark:from-slate-850 dark:to-slate-950 p-6 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-850">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 dark:bg-white/10 dark:border-white/20 flex items-center justify-center text-primary dark:text-white font-bold text-2xl">
                    {lead.firstName[0]}
                    {lead.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-sm opacity-80 mt-0.5">{lead.company}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Address info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-slate-500 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm font-medium text-primary hover:underline mt-0.5 block"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>

                {/* Phone Number info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-slate-500 dark:text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Phone Number
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">
                      {lead.phone || "No phone logged"}
                    </span>
                  </div>
                </div>

                {/* Lead Source info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-slate-500 dark:text-slate-400">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Lead Source
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">
                      {lead.source || "Organic"}
                    </span>
                  </div>
                </div>

                {/* Deal Value info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-slate-500 dark:text-slate-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Estimated Deal Value
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-emerald-400 mt-0.5 block">
                      {formatCurrency(lead.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <FileText className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <h4 className="font-bold text-slate-900 dark:text-white">Dossier Conversation Notes</h4>
              </div>
              <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                {lead.notes || "No conversation logs or notes have been logged for this prospect dossier yet."}
              </p>
            </div>
          </div>

          {/* Right panel: Metadata & Live status transition control */}
          <div className="space-y-6">
            {/* Status Control Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pipeline Status Controller</h4>
              <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-xs text-slate-400">Current Status:</span>
                <StatusActions leadId={lead.id} currentStatus={lead.status} className="w-full" />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                Allowed destination paths strictly validate based on CRM workflow rules. Terminal states lock status adjustments permanently.
              </p>
            </div>

            {/* Timestamp Audit Logs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dossier Audit Logs</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">Registered At</div>
                    <div className="text-xs text-slate-650 dark:text-slate-350 font-medium mt-0.5">
                      {formatFullDate(lead.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">Last Profile Update</div>
                    <div className="text-xs text-slate-650 dark:text-slate-350 font-medium mt-0.5">
                      {formatFullDate(lead.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete conformation modal */}
      {lead && (
        <DeleteLeadDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          leadName={`${lead.firstName} ${lead.lastName}`}
        />
      )}
    </div>
  )
}

export default LeadDetailPage
