import ShowsTable from "./ShowsTable"

import db from "@/configs/db"
import { fetchDashboardShows, fetchShowsByDate } from "@/server-actions/show"
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

  // Fetch today's shows for the timeline initial state
  const todayShows = await fetchShowsByDate(new Date())

  return (
    <>
      <section className="p-4">
        <ShowsTable shows={shows} movies={movies} todayShows={todayShows} />
      </section>
    </>
  )
}

export default Shows
