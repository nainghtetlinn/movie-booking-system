import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CircleAlert } from "lucide-react"
import Hero from "./_components/Hero"
import NowPlaying from "./_components/NowPlaying"
import Shows from "./_components/Shows"
import Movies from "./_components/Movies"

import db from "prisma/db"

const Home = async () => {
  const today = new Date(2024, 5, 2, 11)
  const startDate = new Date(today)
  startDate.setHours(0, 0, 0, 0)

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

  return (
    <>
      <Hero />
      <div className="container">
        <Alert>
          <CircleAlert className="h-5 w-5" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Today date is hard coded {today.toISOString()}</AlertDescription>
        </Alert>
      </div>
      <NowPlaying show={nowPlaying} />
      <Movies movies={movies} />
      <Shows shows={shows} />
    </>
  )
}

export default Home
