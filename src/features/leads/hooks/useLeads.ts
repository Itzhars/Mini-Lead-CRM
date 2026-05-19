import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { leadService } from "../services/lead.service"
import { leadKeys } from "./queryKeys"
import type { Lead, LeadCreateInput, LeadUpdateInput } from "../types/lead.types"
import type { ApiErrorResponse } from "@/api/client"

/**
 * Custom hook to fetch all leads.
 */
export function useLeads() {
  return useQuery<Lead[], ApiErrorResponse>({
    queryKey: leadKeys.list(),
    queryFn: leadService.getLeads,
  })
}

/**
 * Custom hook to fetch a single lead.
 */
export function useLead(id: string) {
  return useQuery<Lead, ApiErrorResponse>({
    queryKey: leadKeys.detail(id),
    queryFn: () => leadService.getLead(id),
    enabled: !!id,
  })
}

/**
 * Custom hook to create a new lead.
 */
export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation<Lead, ApiErrorResponse, LeadCreateInput>({
    mutationFn: leadService.createLead,
    onSuccess: (newLead) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() })
      toast.success(`Lead for "${newLead.firstName} ${newLead.lastName}" created successfully!`)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create lead.")
    },
  })
}

/**
 * Custom hook to update a lead (utilizing Optimistic Updates & Rollbacks).
 */
export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation<
    Lead,
    ApiErrorResponse,
    { id: string; data: LeadUpdateInput },
    { previousLeads: Lead[] | undefined; previousLeadDetail: Lead | undefined; id: string }
  >({
    mutationFn: ({ id, data }) => leadService.updateLead(id, data),
    
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.all })

      const previousLeads = queryClient.getQueryData<Lead[]>(leadKeys.list())
      const previousLeadDetail = queryClient.getQueryData<Lead>(leadKeys.detail(id))

      // Optimistically update list
      if (previousLeads) {
        queryClient.setQueryData<Lead[]>(
          leadKeys.list(),
          previousLeads.map((lead) =>
            lead.id === id ? { ...lead, ...data, updatedAt: new Date().toISOString() } : lead
          )
        )
      }

      // Optimistically update details
      if (previousLeadDetail) {
        queryClient.setQueryData<Lead>(leadKeys.detail(id), {
          ...previousLeadDetail,
          ...data,
          updatedAt: new Date().toISOString(),
        })
      }

      return { previousLeads, previousLeadDetail, id }
    },

    onError: (error, { id }, context) => {
      if (context) {
        if (context.previousLeads) {
          queryClient.setQueryData(leadKeys.list(), context.previousLeads)
        }
        if (context.previousLeadDetail) {
          queryClient.setQueryData(leadKeys.detail(id), context.previousLeadDetail)
        }
      }
      toast.error(error.message || "Failed to update lead.")
    },

    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() })
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) })
      if (!error && data) {
        toast.success(`Lead details updated successfully.`)
      }
    },
  })
}

/**
 * Custom hook to delete a lead (utilizing Optimistic Updates & Rollbacks).
 */
export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    ApiErrorResponse,
    string,
    { previousLeads: Lead[] | undefined }
  >({
    mutationFn: leadService.deleteLead,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.all })

      const previousLeads = queryClient.getQueryData<Lead[]>(leadKeys.list())

      // Optimistically remove from list
      if (previousLeads) {
        queryClient.setQueryData<Lead[]>(
          leadKeys.list(),
          previousLeads.filter((lead) => lead.id !== id)
        )
      }

      return { previousLeads }
    },

    onError: (error, _id, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(leadKeys.list(), context.previousLeads)
      }
      toast.error(error.message || "Failed to delete lead.")
    },

    onSettled: (_, error) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() })
      if (!error) {
        toast.success("Lead record removed successfully.")
      }
    },
  })
}
