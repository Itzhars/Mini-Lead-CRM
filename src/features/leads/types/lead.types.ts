export const LEAD_STATUS = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  QUALIFIED: "QUALIFIED",
  CONVERTED: "CONVERTED",
  LOST: "LOST",
} as const

export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS]

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company: string
  value?: number
  status: LeadStatus
  notes?: string
  assignedTo?: string
  source?: string
  createdAt: string
  updatedAt: string
}

export type LeadCreateInput = Omit<Lead, "id" | "createdAt" | "updatedAt">
export type LeadUpdateInput = Partial<LeadCreateInput>
