"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import DeleteShowBtn from "./DeleteShowBtn"
import EditShowBtn from "./EditShowBtn"

import { TShowTable } from "@/types/show"
import { useState } from "react"

const ActionsBtn = ({ show }: { show: TShowTable }) => {
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

export default ActionsBtn
