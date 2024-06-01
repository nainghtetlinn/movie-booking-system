"use client"

import Filter from "@/components/Filter"
import Table from "@/components/Table"
import ToggleTableViewBtn from "@/components/ToggleTableViewBtn"
import CreateMovieBtn from "./_components/CreateMovieBtn"

import { useTable } from "@/hooks/useTable"
import { TMovieTableItem } from "@/types/movie"
import { columns } from "./columns"

const MoviesTable = ({ movies }: { movies: TMovieTableItem[] }) => {
  const table = useTable({ data: movies, columns })

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
