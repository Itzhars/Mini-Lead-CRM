import React from "react"
import { useDroppable } from "@dnd-kit/core"
import { type LeadStatus, LEAD_STATUS } from "../types/lead.types"

interface BoardColumnProps {
  id: LeadStatus
  title: string
  count: number
  totalValue: number
  children: React.ReactNode
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  id,
  title,
  count,
  totalValue,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Returns matching colored headings matching status classes
  const getHeaderColorClass = (status: LeadStatus) => {
    switch (status) {
      case LEAD_STATUS.NEW:
        return "border-sky-500 text-sky-700 dark:text-sky-400 bg-sky-500/10"
      case LEAD_STATUS.CONTACTED:
        return "border-indigo-500 text-indigo-700 dark:text-indigo-400 bg-indigo-500/10"
      case LEAD_STATUS.QUALIFIED:
        return "border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-500/10"
      case LEAD_STATUS.CONVERTED:
        return "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10"
      case LEAD_STATUS.LOST:
        return "border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-500/10"
      default:
        return "border-slate-500 text-slate-700 dark:text-slate-400 bg-slate-500/10"
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] w-full max-w-[340px] h-[calc(100vh-230px)] rounded-xl border transition-colors duration-200 ${
        isOver
          ? "border-primary bg-slate-50/50 dark:bg-slate-900/40"
          : "border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10"
      }`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getHeaderColorClass(id)}`}>
            {title}
          </span>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full font-semibold text-slate-550 dark:text-slate-450">
            {count}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-emerald-500/90 font-mono">
          {formatCurrency(totalValue)}
        </span>
      </div>

      {/* Cards List container - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none custom-scrollbar">
        {children}
      </div>
    </div>
  )
}

export default BoardColumn
