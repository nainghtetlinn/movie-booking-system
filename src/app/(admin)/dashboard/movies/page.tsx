import MoviesTable from "./MoviesTable"

import { fetchDashboardMovies } from "@/server-actions/movie"
import { redirect } from "next/navigation"

const Movies = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: "all" | "showing" | "upcoming" }>
}) => {
  const { filter } = await searchParams
  if (filter && !["all", "showing", "upcoming"].includes(filter)) redirect("/dashboard/movies")

  const movies = await fetchDashboardMovies(filter || "all")

  return (
    <>
      <section className="p-4">
        <MoviesTable movies={movies} />
      </section>
    </>
  )
}

export default Movies
