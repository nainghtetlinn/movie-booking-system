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
import { Loader2, Trash } from "lucide-react"

import { deleteMovie } from "@/server-actions/movie"
import { Movie } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"

const DeleteMovieBtn = ({ movie, close }: { movie: Movie; close: () => void }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteMovie(movie.id)
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
              Do you really want to delete <span className="text-2xl">"{movie.title}"</span> ?
            </DialogTitle>
            <DialogDescription>
              Please delete related shows first, otherwise it will fail.
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

export default DeleteMovieBtn
