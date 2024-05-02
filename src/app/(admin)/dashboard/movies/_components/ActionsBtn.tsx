"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Movie } from "@prisma/client"
import { MoreHorizontal } from "lucide-react"
import DeleteMovieBtn from "./DeleteMovieBtn"
import EditMovieBtn from "./EditMovieBtn"

import { useState } from "react"

const ActionsBtn = ({ movie }: { movie: Movie }) => {
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

export default ActionsBtn
