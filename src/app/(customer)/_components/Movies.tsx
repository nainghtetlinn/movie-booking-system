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
      <section className="container mb-12">
        <TitleTypography>Movies</TitleTypography>
        <div>
          <Carousel
            items={movies}
            render={(movie) => {
              return (
                <div className="select-none overflow-hidden rounded-lg">
                  <div className="relative aspect-[2/3] max-h-[400px] w-full">
                    <Link href={`/movies/${movie.title.replaceAll(" ", "_")}`}>
                      <Image
                        src={movie.posterUrl}
                        alt={`Poster of ${movie.title}`}
                        fill
                        className="object-contain"
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
                      <Link href={`/booking?id=${movie.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              )
            }}
          />
        </div>
      </section>
    </>
  )
}

export default Movies
