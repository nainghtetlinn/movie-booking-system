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
import ShowForm from "./ShowForm"

import { createShow } from "@/server-actions/show"
import { TShow } from "@/types/show"
import { Prisma } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"
import { useShowForm } from "./show-hooks"

const CreateShowBtn = ({
  movies,
}: {
  movies: Prisma.MovieGetPayload<{ select: { id: true; title: true } }>[]
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useShowForm()

  const onSubmit = async (data: TShow) => {
    setLoading(true)
    const result = await createShow(data)
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
            Create Show
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Show</DialogTitle>
            <DialogDescription>Click save to create new show.</DialogDescription>
          </DialogHeader>

          <ShowForm form={form} movies={movies} />

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

export default CreateShowBtn
