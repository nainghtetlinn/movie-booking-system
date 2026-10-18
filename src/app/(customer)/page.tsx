import Hero from "./_components/Hero"
import NowPlaying from "./_components/NowPlaying"
import TodayShows from "./_components/TodayShows"
import Shows from "./_components/Shows"
import Movies from "./_components/Movies"

import db from "@/configs/db"

const Home = async () => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(today)
  endDate.setHours(23, 59, 59)

  const shows = await db.show.findMany({
    where: {
      date: {
        gte: startDate.toISOString(),
      },
    },
    include: {
      movie: true,
    },
    orderBy: {
      startTime: "asc",
    },
  })

  const movies = await db.movie.findMany({
    orderBy: {
      releaseDate: "asc",
    },
  })

  const nowPlaying = await db.show.findFirst({
    where: {
      startTime: {
        lte: today.toISOString(),
      },
      endTime: {
        gte: today.toISOString(),
      },
    },
    include: {
      movie: true,
    },
  })

  const todayShows = await db.show.findMany({
    where: {
      date: {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      },
    },
    include: {
      movie: true,
    },
    orderBy: {
      startTime: "asc",
    },
  })

  return (
    <>
      <Hero />
      <NowPlaying show={nowPlaying} />
      <TodayShows shows={todayShows} />
      <Movies movies={movies} />
      <Shows shows={shows} />
    </>
  )
}

export default Home
