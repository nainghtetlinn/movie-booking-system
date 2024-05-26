"use client"

import Carousel from "@/components/Carousel"
import TitleTypography from "@/components/TitleTypography"
import { Button } from "@/components/ui/button"

import { formatTime } from "@/lib/utils"
import { Movie } from "@prisma/client"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

interface Props {
  movies: Movie[]
}

const Movies = ({ movies }: Props) => {
  return (
    <>
      <section className="mb-12">
        <div className="container">
          <TitleTypography>Movies</TitleTypography>
        </div>
        {movies.length > 0 ? (
          <Carousel
            items={movies}
            render={(movie) => {
              return (
                <div className="flex select-none flex-col items-center">
                  <div className="relative aspect-[2/3] w-full max-w-[350px] overflow-hidden rounded-lg">
                    <Link href={`/movies/${movie.title.replaceAll(" ", "_")}`}>
                      <Image
                        src={movie.posterUrl}
                        alt={`Poster of ${movie.title}`}
                        width={200}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  </div>
                  <div className="p-2 text-center">
                    <h6 className="mb-2 text-xl font-semibold transition-colors hover:text-primary">
                      <Link href={`/movies/${movie.title.replaceAll(" ", "_")}`}>
                        {movie.title}
                      </Link>
                    </h6>
                    <p>{formatTime(movie.durationInMins)}</p>
                    <p>Released {format(movie.releaseDate, "MMM d, yyyy")}</p>
                    <Button className="mt-2" asChild>
                      <Link href={`/booking?movieId=${movie.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              )
            }}
          />
        ) : (
          <div className="container">Currently, no movies found.</div>
        )}
      </section>
    </>
  )
}

export default Movies
