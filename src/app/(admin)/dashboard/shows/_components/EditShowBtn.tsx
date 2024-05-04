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
import { Edit, Loader2 } from "lucide-react"
import ShowForm from "./ShowForm"

import { editShow } from "@/server-actions/show"
import { TShow, TShowTable } from "@/types/show"
import { useState } from "react"
import { toast } from "sonner"
import { useShowForm } from "./show-hooks"

const EditShowBtn = ({ show, close }: { show: TShowTable; close: () => void }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useShowForm(show)

  const onSubmit = async (data: TShow) => {
    setLoading(true)
    const result = await editShow(show.id, data)
    if (result.success) {
      setOpen(false)
      close()
      toast.success("Success")
    } else {
      toast.error(result.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Show</DialogTitle>
            <DialogDescription>Click save to update show.</DialogDescription>
          </DialogHeader>

          <ShowForm form={form} movies={[{ id: show.movieId, title: show.movie.title }]} />

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

export default EditShowBtn
