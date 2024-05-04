"use client"

import Table from "@/components/Table"
import ToggleTableViewBtn from "@/components/ToggleTableViewBtn"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import CreateShowBtn from "./_components/CreateShowBtn"

import { TShowMovieOptions, TShowTableItem } from "@/types/show"
import {
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { columns } from "./columns"

const ShowsTable = ({ shows, movies }: { shows: TShowTableItem[]; movies: TShowMovieOptions }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data: shows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
  })

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <ToggleGroup type="single" defaultValue="all">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="today">Today</ToggleGroupItem>
          <ToggleGroupItem value="upcoming">Upcoming</ToggleGroupItem>
        </ToggleGroup>
        <div className="space-x-2">
          <ToggleTableViewBtn table={table} />
          <CreateShowBtn movies={movies} />
        </div>
      </div>
      <Table
        title="Shows"
        description="Manage your shows."
        columnsLength={columns.length}
        table={table}
      />
    </>
  )
}

export default ShowsTable
