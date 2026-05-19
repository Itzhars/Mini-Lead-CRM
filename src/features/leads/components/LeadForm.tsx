import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { leadSchema, type LeadFormData } from "../schemas/lead.schema"
import { LEAD_STATUS } from "../types/lead.types"

interface LeadFormProps {
  defaultValues?: Partial<LeadFormData>
  onSubmit: (data: LeadFormData) => void
  submitLabel?: string
  isLoading?: boolean
}

export const LeadForm: React.FC<LeadFormProps> = ({
  defaultValues,
  onSubmit,
  submitLabel = "Save Prospect",
  isLoading = false,
}) => {
  // Inferred types directly via zodResolver for absolute compatibility with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      value: undefined,
      status: LEAD_STATUS.NEW,
      source: "",
      notes: "",
      ...defaultValues,
    },
    mode: "onChange",
  })

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as LeadFormData))} className="space-y-6 max-w-3xl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              First Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="e.g. John"
              {...register("firstName")}
              className={`h-10 text-sm ${errors.firstName ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-200 dark:border-slate-800"}`}
            />
            {errors.firstName && (
              <p className="text-xs text-rose-500 font-medium">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Last Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="e.g. Doe"
              {...register("lastName")}
              className={`h-10 text-sm ${errors.lastName ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-200 dark:border-slate-800"}`}
            />
            {errors.lastName && (
              <p className="text-xs text-rose-500 font-medium">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Email Address <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. john.doe@acme.com"
              {...register("email")}
              className={`h-10 text-sm ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-200 dark:border-slate-800"}`}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Input */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. +1 (555) 019-2834"
              {...register("phone")}
              className="h-10 text-sm border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Input */}
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Company Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="e.g. Acme Corp"
              {...register("company")}
              className={`h-10 text-sm ${errors.company ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-200 dark:border-slate-800"}`}
            />
            {errors.company && (
              <p className="text-xs text-rose-500 font-medium">{errors.company.message}</p>
            )}
          </div>

          {/* Estimated Value Input */}
          <div className="space-y-1.5">
            <Label htmlFor="value" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Estimated Deal Value ($)
            </Label>
            <Input
              id="value"
              type="number"
              placeholder="e.g. 5000"
              {...register("value")}
              className="h-10 text-sm border-slate-200 dark:border-slate-800"
            />
            {errors.value && (
              <p className="text-xs text-rose-500 font-medium">{errors.value.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Select */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Pipeline Status
            </Label>
            <select
              id="status"
              {...register("status")}
              className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {Object.values(LEAD_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Lead Source Input */}
          <div className="space-y-1.5">
            <Label htmlFor="source" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Lead Source
            </Label>
            <Input
              id="source"
              type="text"
              placeholder="e.g. Ads, Referral, organic"
              {...register("source")}
              className="h-10 text-sm border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>

        {/* Notes Input */}
        <div className="space-y-1.5">
          <Label htmlFor="notes" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
            Dossier Notes
          </Label>
          <textarea
            id="notes"
            placeholder="Log conversation history, notes or timeline specifics..."
            rows={4}
            {...register("notes")}
            className="flex min-h-[80px] w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Submission Actions */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="gap-2 shadow-sm min-w-[140px] text-xs h-10"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
