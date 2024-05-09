"use server"

import db from "prisma/db"

export async function getMovies() {
  return await db.movie.findMany({
    select: { id: true, title: true, posterUrl: true, durationInMins: true },
  })
}

export async function getShows(movieId: string) {
  return await db.show.findMany({
    where: {
      movieId,
    },
    orderBy: { startTime: "asc" },
  })
}

export async function getSeats(showId: string) {
  return await db.seat.findMany({
    include: {
      showSeatRelation: {
        where: {
          showId,
        },
      },
    },
  })
}

export async function getCheckout({
  movieId,
  showId,
  seatIds,
}: {
  movieId: string
  showId: string
  seatIds: string[]
}) {
  const movie = await db.movie.findUnique({ where: { id: movieId } })
  const show = await db.show.findUnique({ where: { id: showId } })
  const seats = await db.seat.findMany({ where: { id: { in: seatIds } } })
  return { movie, show, seats }
}
