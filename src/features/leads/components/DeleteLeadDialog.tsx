import React from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteLeadDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  leadName: string
  isLoading?: boolean
}

export const DeleteLeadDialog: React.FC<DeleteLeadDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-xl">
        <DialogHeader className="space-y-3">
          <div className="mx-auto sm:mx-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Lead Prospect?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete lead record <strong className="text-slate-900 dark:text-white font-semibold">{leadName}</strong>? This action is permanent and cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs h-10 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2 text-xs h-10 min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteLeadDialog
