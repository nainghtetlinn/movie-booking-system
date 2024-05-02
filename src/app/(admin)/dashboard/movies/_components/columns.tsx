"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"
import ActionsBtn from "./ActionsBtn"

import { formatTime } from "@/lib/utils"
import { Movie } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columns: ColumnDef<Movie>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "durationInMins",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Duration
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )
        ) : null}
      </Button>
    ),
    cell: ({ row }) => formatTime(row.getValue("durationInMins")),
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Release Date
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )
        ) : null}
      </Button>
    ),
    cell: ({ row }) => format(row.getValue("releaseDate"), "MMM d, yyyy"),
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("genre")}</Badge>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsBtn movie={row.original} />,
  },
]
