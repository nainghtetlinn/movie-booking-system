import ShowsTable from "./ShowsTable"

import db from "@/configs/db"
import { fetchDashboardShows } from "@/server-actions/show"
import { redirect } from "next/navigation"

const Shows = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: "all" | "showing" | "upcoming" }>
}) => {
  const { filter } = await searchParams
  if (filter && !["all", "showing", "upcoming"].includes(filter)) redirect("/dashboard/shows")

  const shows = await fetchDashboardShows(filter || "all")

  const movies = await db.movie.findMany({
    select: { id: true, title: true, durationInMins: true },
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
