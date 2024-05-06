"use client"

import TableSortingBtn from "@/components/TableSortingBtn"
import { Badge } from "@/components/ui/badge"
import ActionsBtn from "./_components/ActionsBtn"

import { formatTime } from "@/lib/utils"
import { TMovieTableItem } from "@/types/movie"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const columns: ColumnDef<TMovieTableItem>[] = [
  {
    id: "poster",
    accessorKey: "posterUrl",
    header: "Poster",
    cell: ({ row }) => <img src={row.getValue("poster")} alt={row.getValue("title")} width={60} />,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "duration",
    accessorKey: "durationInMins",
    header: ({ column }) => <TableSortingBtn title="Duration" column={column} />,
    cell: ({ row }) => formatTime(row.getValue("duration")),
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => <TableSortingBtn title="Release Date" column={column} />,
    cell: ({ row }) => format(row.getValue("releaseDate"), "MMM d, yyyy"),
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("genre")}</Badge>,
  },
  {
    id: "shows",
    accessorKey: "_count.shows",
    header: "Shows",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsBtn movie={row.original} />,
  },
]
