"use client"

import Filter from "@/components/Filter"
import Table from "@/components/Table"
import ToggleTableViewBtn from "@/components/ToggleTableViewBtn"
import CreateShowBtn from "./_components/CreateShowBtn"

import { useTable } from "@/hooks/useTable"
import { TShowMovieOptions, TShowTableItem } from "@/types/show"
import { columns } from "./columns"

const ShowsTable = ({ shows, movies }: { shows: TShowTableItem[]; movies: TShowMovieOptions }) => {
  const table = useTable({ data: shows, columns })

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Filter
          searchParamKey="filter"
          defaultOptions="all"
          options={["all", "showing", "upcoming"]}
        />
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
