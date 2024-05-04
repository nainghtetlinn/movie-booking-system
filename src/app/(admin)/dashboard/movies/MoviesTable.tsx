"use client"

import Table from "@/components/Table"
import ToggleTableViewBtn from "@/components/ToggleTableViewBtn"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import CreateMovieBtn from "./_components/CreateMovieBtn"

import { TMovieTableItem } from "@/types/movie"
import {
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { columns } from "./columns"

const MoviesTable = ({ movies }: { movies: TMovieTableItem[] }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data: movies,
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
          <ToggleGroupItem value="showing">Showing</ToggleGroupItem>
          <ToggleGroupItem value="upcoming">Upcoming</ToggleGroupItem>
        </ToggleGroup>
        <div className="space-x-2">
          <ToggleTableViewBtn table={table} />
          <CreateMovieBtn />
        </div>
      </div>
      <Table
        title="Movies"
        description="Manage your movies."
        columnsLength={columns.length}
        table={table}
      />
    </>
  )
}

export default MoviesTable
