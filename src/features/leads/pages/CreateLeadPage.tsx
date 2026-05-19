import React from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadForm } from "../components/LeadForm"
import { useCreateLead } from "../hooks/useLeads"
import type { LeadFormData } from "../schemas/lead.schema"

export const CreateLeadPage: React.FC = () => {
  const navigate = useNavigate()
  const { mutateAsync: createLead, isPending } = useCreateLead()

  const handleSubmit = async (data: LeadFormData) => {
    try {
      await createLead(data)
      navigate("/leads")
    } catch {
      // Errors handled gracefully by global Sonner alert in useCreateLead hook
    }
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
          <Link to="/leads">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Register Lead</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Initialize a new business opportunity in your CRM pipeline.
          </p>
        </div>
      </div>

      {/* Main registration form */}
      <LeadForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Register Lead" />
    </div>
  )
}

export default CreateLeadPage
