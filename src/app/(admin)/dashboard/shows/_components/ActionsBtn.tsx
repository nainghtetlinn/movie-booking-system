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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Loader2, MoreHorizontal, Trash } from "lucide-react"
import ShowForm from "./ShowForm"

import { deleteShow, editShow } from "@/server-actions/show"
import { TShow, TShowTableItem } from "@/types/show"
import { useState } from "react"
import { toast } from "sonner"
import { useShowForm } from "./show-hooks"

const ActionsBtn = ({ show }: { show: TShowTableItem }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <EditShowBtn show={show} close={() => setOpen(false)} />
          <DeleteShowBtn show={show} close={() => setOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const EditShowBtn = ({ show, close }: { show: TShowTableItem; close: () => void }) => {
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

const DeleteShowBtn = ({ show, close }: { show: TShowTableItem; close: () => void }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteShow(show.id)
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
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Do you really want to delete the show of
              <span className="text-2xl"> "{show.movie.title}"</span> ?
            </DialogTitle>
            <DialogDescription>
              If there is bookings related to this show, it will fail.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button disabled={loading} onClick={handleDelete}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActionsBtn
