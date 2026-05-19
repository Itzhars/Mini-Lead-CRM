import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { Link } from "react-router-dom"
import { Building2, DollarSign, Mail, Eye, GripVertical } from "lucide-react"
import { type Lead } from "../types/lead.types"

interface BoardLeadCardProps {
  lead: Lead
}

export const BoardLeadCard: React.FC<BoardLeadCardProps> = ({ lead }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  })

  // Format position transform matrix
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "$0"
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-150 relative group ${
        isDragging ? "opacity-40 cursor-grabbing border-primary" : "cursor-grab"
      }`}
    >
      {/* Top drag handle indicator and title */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {lead.firstName} {lead.lastName}
          </h5>
          {lead.company && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[130px]">{lead.company}</span>
            </div>
          )}
        </div>

        {/* Grab Handle bar for clean touch/pointer grab interactions */}
        <div
          {...attributes}
          {...listeners}
          className="p-1 rounded text-slate-350 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing shrink-0"
          title="Drag Prospect"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Middle contact info */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-550 dark:text-slate-400">
          <Mail className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="truncate max-w-[170px]">{lead.email}</span>
        </div>
      </div>

      {/* Bottom price value metrics and detail links */}
      <div className="mt-4 border-t border-slate-100 dark:border-slate-850 pt-3 flex items-center justify-between">
        <div className="flex items-center text-xs font-bold text-slate-700 dark:text-emerald-400">
          <DollarSign className="h-3.5 w-3.5 -mr-0.5 shrink-0" />
          <span>{formatCurrency(lead.value)}</span>
        </div>

        {/* View Details shortcut link */}
        <Link
          to={`/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-primary hover:border-primary/20 dark:hover:bg-slate-800/50 bg-slate-50 dark:bg-slate-950/40 transition-colors"
          title="Dossier details"
        >
          <Eye className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default BoardLeadCard
