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
import MovieForm from "./MovieForm"

import { deleteMovie, editMovie } from "@/server-actions/movie"
import { TMovie, TMovieTableItem } from "@/types/movie"
import { useState } from "react"
import { toast } from "sonner"
import { useMovieForm } from "./movie-hooks"

const ActionsBtn = ({ movie }: { movie: TMovieTableItem }) => {
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
          <EditMovieBtn movie={movie} close={() => setOpen(false)} />
          <DeleteMovieBtn movie={movie} close={() => setOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const EditMovieBtn = ({ movie, close }: { movie: TMovieTableItem; close: () => void }) => {
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

const DeleteMovieBtn = ({ movie, close }: { movie: TMovieTableItem; close: () => void }) => {
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

export default ActionsBtn
