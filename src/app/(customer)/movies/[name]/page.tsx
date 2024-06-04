import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import db from "prisma/db"
import { formatTime } from "@/lib/utils"
import { format } from "date-fns"

const MoviePage = async ({ params }: { params: { name: string } }) => {
  const movie = await db.movie.findFirst({
    where: {
      title: params.name.replaceAll("_", " "),
    },
  })

  if (!movie) notFound()

  return (
    <main className="container min-h-[80vh] py-4">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>{movie.title}</CardTitle>
          <CardDescription>Description: {movie.description}</CardDescription>
          <CardDescription>Genre: {movie.genre}</CardDescription>
          <CardDescription>Duration: {formatTime(movie.durationInMins)}</CardDescription>
          <CardDescription>
            Release Date: {format(movie.releaseDate, "MMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Image
              src={movie.posterUrl}
              alt={`Poster of ${movie.title}`}
              width={200}
              height={300}
              className="aspect-[2/3] w-full max-w-[350px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link href={`/booking?movieId=${movie.id}`}>Book now</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

export default MoviePage
