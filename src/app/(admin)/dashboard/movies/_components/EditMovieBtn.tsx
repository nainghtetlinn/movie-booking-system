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
import MovieForm from "./MovieForm"

import { editMovie } from "@/server-actions/movie"
import { TMovie } from "@/types/movie"
import { Movie } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"
import { useMovieForm } from "./movie-hooks"

const EditMovieBtn = ({ movie, close }: { movie: Movie; close: () => void }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useMovieForm(movie)

  const onSubmit = async (data: TMovie) => {
    setLoading(true)
    const result = await editMovie(movie.id, data)
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
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>Click save to update movie.</DialogDescription>
          </DialogHeader>

          <MovieForm form={form} />

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

export default EditMovieBtn
