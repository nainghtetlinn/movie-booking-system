"use client"

import { Badge } from "@/components/ui/badge"
import ActionsBtn from "./_components/ActionsBtn"

import { TBookingTableItem } from "@/types/booking"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columns: ColumnDef<TBookingTableItem>[] = [
  {
    header: "Email",
    accessorFn: (row) => row.email,
  },
  {
    header: "Movie",
    accessorFn: (row) => row.tickets[0].show.movie.title,
  },
  {
    header: "Booked At",
    accessorFn: (row) => format(row.createdAt, "MMM d, yyyy"),
  },
  {
    header: "Show",
    accessorFn: (row) =>
      `${format(row.tickets[0].show.startTime, "hh:mmaa")} - ${format(row.tickets[0].show.endTime, "hh:mmaa")}`,
  },
  {
    id: "tickets",
    header: "Tickets",
    accessorFn: (row) => row.tickets,
    cell: ({ row }) => (
      <span>{row.original.tickets.map((t) => t.seat.row + t.seat.number).join(", ")}</span>
    ),
  },
  {
    header: "Amount",
    accessorFn: (row) => row.totalAmount,
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => row.status,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("status")}</Badge>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsBtn booking={row.original} />,
  },
]
