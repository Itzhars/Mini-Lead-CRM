import { apiClient } from "@/api/client"
import type { Lead, LeadCreateInput, LeadUpdateInput } from "../types/lead.types"

export const leadService = {
  /**
   * Fetch all leads.
   */
  async getLeads(): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>("/leads")
    return response.data
  },

  /**
   * Fetch a single lead by ID.
   */
  async getLead(id: string): Promise<Lead> {
    const response = await apiClient.get<Lead>(`/leads/${id}`)
    return response.data
  },

  /**
   * Create a new lead.
   */
  async createLead(leadData: LeadCreateInput): Promise<Lead> {
    const response = await apiClient.post<Lead>("/leads", leadData)
    return response.data
  },

  /**
   * Update an existing lead.
   */
  async updateLead(id: string, leadData: LeadUpdateInput): Promise<Lead> {
    const response = await apiClient.patch<Lead>(`/leads/${id}`, leadData)
    return response.data
  },

  /**
   * Delete a lead by ID.
   */
  async deleteLead(id: string): Promise<void> {
    await apiClient.delete(`/leads/${id}`)
  },
}
