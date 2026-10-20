"use client"

import TableSortingBtn from "@/components/TableSortingBtn"
import ActionsBtn from "./_components/ActionsBtn"

import Image from "next/image"
import { TShowTableItem } from "@/types/show"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columns: ColumnDef<TShowTableItem>[] = [
  {
    id: "poster",
    accessorKey: "movie.posterUrl",
    header: "Poster",
    cell: ({ row }) => (
      <Image
        src={row.getValue("poster")}
        alt={row.getValue("title")}
        width={60}
        height={90}
        className="aspect-[2/3] object-cover"
      />
    ),
  },
  {
    id: "title",
    accessorKey: "movie.title",
    header: ({ column }) => <TableSortingBtn title="Title" column={column} />,
    cell: ({ row }) => {
      const title: string = row.original.movie.title
      const durationInMins: number = row.original.movie.durationInMins

      // Helper to format minutes into a readable string (e.g., "2h 15m" or "135 mins")
      const formatMovieDuration = (mins: number) => {
        if (!mins) return ""
        const hours = Math.floor(mins / 60)
        const minutes = mins % 60
        if (hours === 0) return `${minutes}m`
        if (minutes === 0) return `${hours}h`
        return `${hours}h ${minutes}m`
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
          {durationInMins > 0 && (
            <span className="text-muted-foreground text-xs">
              {formatMovieDuration(durationInMins)}
            </span>
          )}
        </div>
      )
    },
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
