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
import { Loader2, MoreHorizontal, Trash } from "lucide-react"

import { deleteBooking } from "@/server-actions/booking"
import { TBookingTableItem } from "@/types/booking"
import { useState } from "react"
import { toast } from "sonner"

const ActionsBtn = ({ booking }: { booking: TBookingTableItem }) => {
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

          <DeleteBookingBtn booking={booking} close={() => setOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const DeleteBookingBtn = ({
  booking,
  close,
}: {
  booking: TBookingTableItem
  close: () => void
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteBooking(booking.id)
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
          <Button
            variant="ghost"
            size="sm"
            disabled={booking.status === "paid"}
            className="w-full justify-start">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Do you really want to delete{" "}
              <span className="text-2xl">&quot;{booking.id}&quot;</span> ?
            </DialogTitle>
            <DialogDescription>This is dangerous action, please think twice.</DialogDescription>
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
