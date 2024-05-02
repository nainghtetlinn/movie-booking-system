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
import MovieForm from "./MovieForm"

import { createMovie } from "@/server-actions/movie"
import { TMovie } from "@/types/movie"
import { useState } from "react"
import { toast } from "sonner"
import { useMovieForm } from "./movie-hooks"

const CreateMovieBtn = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useMovieForm()

  const onSubmit = async (data: TMovie) => {
    setLoading(true)
    const result = await createMovie(data)
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
            Create Movie
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Movie</DialogTitle>
            <DialogDescription>Click save to create new movie.</DialogDescription>
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

export default CreateMovieBtn
