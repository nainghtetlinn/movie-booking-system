"use client"

import TableSortingBtn from "@/components/TableSortingBtn"
import ActionsBtn from "./_components/ActionsBtn"

import { TShowTableItem } from "@/types/show"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columns: ColumnDef<TShowTableItem>[] = [
  {
    id: "title",
    accessorKey: "movie.title",
    header: ({ column }) => <TableSortingBtn title="Title" column={column} />,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(row.getValue("date"), "MMM d, yyyy"),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <TableSortingBtn title="Start Time" column={column} />,
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
