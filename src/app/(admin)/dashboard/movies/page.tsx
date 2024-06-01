import MoviesTable from "./MoviesTable"

import { fetchDashboardMovies } from "@/server-actions/movie"
import { redirect } from "next/navigation"

const Movies = async ({
  searchParams,
}: {
  searchParams: { filter?: "all" | "showing" | "upcoming" }
}) => {
  if (searchParams.filter && !["all", "showing", "upcoming"].includes(searchParams.filter))
    redirect("/dashboard/movies")

  const movies = await fetchDashboardMovies(searchParams.filter || "all")

  return (
    <>
      <section className="p-4">
        <MoviesTable movies={movies} />
      </section>
    </>
  )
}

export default Movies
