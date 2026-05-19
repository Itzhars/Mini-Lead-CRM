import React from "react"
import { Link } from "react-router-dom"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusActions } from "./StatusActions"
import type { Lead } from "../types/lead.types"

interface LeadTableProps {
  leads: Lead[]
  onDelete: (id: string) => void
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onDelete }) => {
  const formatCompactDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "N/A"
    }
  }

  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
        <thead className="bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th scope="col" className="px-6 py-4">Name</th>
            <th scope="col" className="px-6 py-4">Email</th>
            <th scope="col" className="px-6 py-4">Status</th>
            <th scope="col" className="px-6 py-4">Source</th>
            <th scope="col" className="px-6 py-4">Updated At</th>
            <th scope="col" className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="hover:bg-slate-50/55 dark:hover:bg-slate-800/20 transition-colors duration-150"
            >
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                <div className="flex flex-col">
                  <span>{lead.firstName} {lead.lastName}</span>
                  {lead.company && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                      {lead.company}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.email}</td>
              <td className="px-6 py-4">
                <StatusActions leadId={lead.id} currentStatus={lead.status} />
              </td>
              <td className="px-6 py-4">
                <span className="text-slate-600 dark:text-slate-300 text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium">
                  {lead.source || "Organic"}
                </span>
              </td>
              <td className="px-6 py-4 text-xs font-mono">{formatCompactDate(lead.updatedAt)}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    asChild
                    title="View details"
                  >
                    <Link to={`/leads/${lead.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    asChild
                    title="Edit profile"
                  >
                    <Link to={`/leads/${lead.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    onClick={() => onDelete(lead.id)}
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
