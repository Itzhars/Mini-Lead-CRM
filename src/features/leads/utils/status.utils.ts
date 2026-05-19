import { type LeadStatus, LEAD_STATUS } from "../types/lead.types"

// Centralized state transition mapping
const TRANSITIONS_MAP: Record<LeadStatus, readonly LeadStatus[]> = {
  [LEAD_STATUS.NEW]: [LEAD_STATUS.CONTACTED, LEAD_STATUS.LOST],
  [LEAD_STATUS.CONTACTED]: [LEAD_STATUS.QUALIFIED, LEAD_STATUS.LOST],
  [LEAD_STATUS.QUALIFIED]: [LEAD_STATUS.CONVERTED, LEAD_STATUS.LOST],
  [LEAD_STATUS.CONVERTED]: [],
  [LEAD_STATUS.LOST]: [],
} as const

/**
 * Retrieves the list of allowed destination statuses for a given source status.
 */
export function getValidTransitions(status: LeadStatus): readonly LeadStatus[] {
  return TRANSITIONS_MAP[status]
}

/**
 * Validates if a transition from one status to another is permitted under CRM rules.
 */
export function canTransition(from: LeadStatus, to: LeadStatus): boolean {
  return TRANSITIONS_MAP[from].includes(to)
}

/**
 * Checks if the given status is a terminal state (i.e. has no outgoing transitions).
 */
export function isTerminalStatus(status: LeadStatus): boolean {
  return TRANSITIONS_MAP[status].length === 0
}
