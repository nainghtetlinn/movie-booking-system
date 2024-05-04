"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"
import StaffForm from "./StaffForm"

import { createStaff } from "@/server-actions/staff"
import { TStaff } from "@/types/staff"
import { useState } from "react"
import { toast } from "sonner"
import { useStaffForm } from "./staff-hooks"

const CreateStaffBtn = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useStaffForm()

  const onSubmit = async (data: TStaff) => {
    setLoading(true)
    const result = await createStaff(data)
    if (result.success) {
      setOpen(false)
      toast.success("Success")
      form.reset()
    } else {
      toast.error(result.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Staff
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Staff</DialogTitle>
            <DialogDescription>Click save to create new staff.</DialogDescription>
          </DialogHeader>

          <StaffForm form={form} />

          <DialogFooter>
            <Button disabled={loading} onClick={form.handleSubmit(onSubmit)}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateStaffBtn
