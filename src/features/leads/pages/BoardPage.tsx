import React, { useMemo } from "react"
import {
  DndContext,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import { toast } from "sonner"
import { useLeads, useUpdateLead } from "../hooks/useLeads"
import { BoardColumn } from "../components/BoardColumn"
import { BoardLeadCard } from "../components/BoardLeadCard"
import { TableSkeleton } from "../components/LeadSkeletons"
import { ErrorState } from "../components/ErrorState"
import { canTransition } from "../utils/status.utils"
import { type LeadStatus, LEAD_STATUS, type Lead } from "../types/lead.types"

export const BoardPage: React.FC = () => {
  const { data: leads, isLoading, isError, error, refetch } = useLeads()
  const { mutateAsync: updateLead } = useUpdateLead()

  // Configure pointer grab threshold constraints to prevent accidental drag triggers on button click shortcuts
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Map and group leads dynamically inside columns with totals
  const columnsData = useMemo(() => {
    const groups: Record<LeadStatus, Lead[]> = {
      [LEAD_STATUS.NEW]: [],
      [LEAD_STATUS.CONTACTED]: [],
      [LEAD_STATUS.QUALIFIED]: [],
      [LEAD_STATUS.CONVERTED]: [],
      [LEAD_STATUS.LOST]: [],
    }

    if (!leads) return groups

    leads.forEach((lead) => {
      groups[lead.status].push(lead)
    })

    return groups
  }, [leads])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    // Dropped outside or cancelled drag
    if (!over) return

    const leadId = active.id as string
    const newStatus = over.id as LeadStatus
    const activeLead = active.data.current?.lead as Lead

    if (!activeLead) return

    const currentStatus = activeLead.status

    // Dropped in the same column
    if (currentStatus === newStatus) return

    // Strict validation of CRM pipeline workflow rules
    if (!canTransition(currentStatus, newStatus)) {
      toast.error(
        `Invalid pipeline workflow transition: Cannot move lead status from "${currentStatus}" directly to "${newStatus}".`,
        {
          duration: 4000,
        }
      )
      return
    }

    try {
      // Optimistic updates are already fully handled inside useUpdateLead cache settings
      await updateLead({
        id: leadId,
        data: { status: newStatus },
      })
    } catch {
      // Errors handled gracefully by global Sonner alert in useUpdateLead hook
    }
  }

  // Returns human readable column titles
  const getColumnTitle = (status: LeadStatus) => {
    switch (status) {
      case LEAD_STATUS.NEW:
        return "New Opportunity"
      case LEAD_STATUS.CONTACTED:
        return "Contacted"
      case LEAD_STATUS.QUALIFIED:
        return "Qualified Deal"
      case LEAD_STATUS.CONVERTED:
        return "Converted Won"
      case LEAD_STATUS.LOST:
        return "Disqualified Lost"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pipeline Board</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track prospect funnels, prioritize values, and drag-and-drop status stages seamlessly.
        </p>
      </div>

      {/* Kanban Layout state checks */}
      {isLoading ? (
        <div className="space-y-4">
          <TableSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          message={error?.message || "Failed to load active pipeline board details."}
          onRetry={refetch}
        />
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 select-none scrollbar-none custom-scrollbar">
            {Object.values(LEAD_STATUS).map((status) => {
              const columnLeads = columnsData[status] || []
              const count = columnLeads.length
              const totalValue = columnLeads.reduce((sum, lead) => sum + (lead.value || 0), 0)

              return (
                <BoardColumn
                  key={status}
                  id={status}
                  title={getColumnTitle(status)}
                  count={count}
                  totalValue={totalValue}
                >
                  {columnLeads.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-400 font-medium select-none">
                      No prospects in this stage
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <BoardLeadCard key={lead.id} lead={lead} />
                    ))
                  )}
                </BoardColumn>
              )
            })}
          </div>
        </DndContext>
      )}
    </div>
  )
}

export default BoardPage
