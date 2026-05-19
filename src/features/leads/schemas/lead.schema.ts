import { z } from "zod"
import { LEAD_STATUS } from "../types/lead.types"

export const leadSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name is too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().min(2, "Company name must be at least 2 characters").max(100, "Company name is too long"),
  value: z.coerce.number().min(0, "Value must be positive").optional(),
  status: z.nativeEnum(LEAD_STATUS).default(LEAD_STATUS.NEW),
  source: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type LeadFormData = z.infer<typeof leadSchema>
