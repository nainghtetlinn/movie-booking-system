"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"
import ActionsBtn from "./ActionsBtn"

import { TShowTable } from "@/types/show"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columns: ColumnDef<TShowTable>[] = [
  {
    id: "Title",
    accessorKey: "movie.title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Title
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )
        ) : null}
      </Button>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(row.getValue("date"), "MMM d, yyyy"),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Start Time
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )
        ) : null}
      </Button>
    ),
    cell: ({ row }) => format(row.getValue("startTime"), "hh : mm aa"),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => format(row.getValue("endTime"), "hh : mm aa"),
  },
  {
    id: "soldTickets",
    accessorKey: "_count.tickets",
    header: "Sold Tickets",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsBtn show={row.original} />,
  },
]
