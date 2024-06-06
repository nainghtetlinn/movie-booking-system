import ShowsTable from "./ShowsTable"

import db from "@/configs/db"
import { fetchDashboardShows } from "@/server-actions/show"
import { redirect } from "next/navigation"

const Shows = async ({
  searchParams,
}: {
  searchParams: { filter?: "all" | "showing" | "upcoming" }
}) => {
  if (searchParams.filter && !["all", "showing", "upcoming"].includes(searchParams.filter))
    redirect("/dashboard/shows")

  const shows = await fetchDashboardShows(searchParams.filter || "all")

  const movies = await db.movie.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  })

  return (
    <>
      <section className="p-4">
        <ShowsTable shows={shows} movies={movies} />
      </section>
    </>
  )
}

export default Shows
