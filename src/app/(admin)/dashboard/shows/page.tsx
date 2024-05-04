import ShowsTable from "./_components/ShowsTable"

import db from "prisma/db"

const Shows = async () => {
  const shows = await db.show.findMany({
    include: {
      movie: { select: { title: true } },
      _count: { select: { tickets: true } },
    },
    orderBy: {
      startTime: "asc",
    },
  })

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
