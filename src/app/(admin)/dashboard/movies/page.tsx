import MoviesTable from "./_components/MoviesTable"

import db from "prisma/db"

const Movies = async () => {
  const movies = await db.movie.findMany({
    include: {
      _count: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <section className="p-4">
        <MoviesTable movies={movies} />
      </section>
    </>
  )
}

export default Movies
