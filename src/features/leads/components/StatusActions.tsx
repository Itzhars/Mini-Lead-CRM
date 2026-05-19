import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Lock, Loader2 } from "lucide-react"
import { getValidTransitions, isTerminalStatus } from "../utils/status.utils"
import { type LeadStatus, LEAD_STATUS } from "../types/lead.types"
import { useUpdateLead } from "../hooks/useLeads"

interface StatusActionsProps {
  leadId: string
  currentStatus: LeadStatus
  className?: string
}

export const StatusActions: React.FC<StatusActionsProps> = ({
  leadId,
  currentStatus,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { mutateAsync: updateStatus, isPending } = useUpdateLead()

  const validTransitions = getValidTransitions(currentStatus)
  const isTerminal = isTerminalStatus(currentStatus)

  // Auto close on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard accessibility listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleTransition = async (newStatus: LeadStatus) => {
    setIsOpen(false)
    try {
      await updateStatus({
        id: leadId,
        data: { status: newStatus },
      })
    } catch {
      // Errors handled gracefully by global Sonner alert in useUpdateLead hook
    }
  }

  // Returns matching styles for the dropdown active display
  const getStatusColorClass = (status: LeadStatus) => {
    switch (status) {
      case LEAD_STATUS.NEW:
        return "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-850"
      case LEAD_STATUS.CONTACTED:
        return "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-850"
      case LEAD_STATUS.QUALIFIED:
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-850"
      case LEAD_STATUS.CONVERTED:
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-850"
      case LEAD_STATUS.LOST:
        return "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-850"
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-750"
    }
  }

  if (isTerminal) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${getStatusColorClass(currentStatus)} select-none ${className}`}>
        <span>{currentStatus}</span>
        <Lock className="h-3 w-3 opacity-60" />
      </div>
    )
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColorClass(currentStatus)}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <span>{currentStatus}</span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-40 w-44 origin-top-left rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1.5 select-none">
            Allowed Actions
          </div>
          <div className="space-y-0.5" role="menu" aria-orientation="vertical">
            {validTransitions.map((status) => (
              <button
                key={status}
                onClick={() => handleTransition(status)}
                className="w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                role="menuitem"
              >
                <span>Move to {status}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  status === LEAD_STATUS.CONTACTED ? "bg-indigo-500" :
                  status === LEAD_STATUS.QUALIFIED ? "bg-amber-500" :
                  status === LEAD_STATUS.CONVERTED ? "bg-emerald-500" :
                  status === LEAD_STATUS.LOST ? "bg-rose-500" : "bg-slate-500"
                }`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusActions
