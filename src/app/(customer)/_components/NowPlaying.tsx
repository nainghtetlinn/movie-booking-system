import TitleTypography from "@/components/TitleTypography"
import Image from "next/image"

import { formatTime } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import { format } from "date-fns"

interface Props {
  show: Prisma.ShowGetPayload<{ include: { movie: true } }> | null
}

const NowPlaying = ({ show }: Props) => {
  return (
    <>
      <section className="container mb-12">
        <TitleTypography>Now Playing</TitleTypography>

        {show ? (
          <div className="flex justify-center">
            <div className="w-[300px] overflow-hidden rounded-lg bg-secondary sm:flex sm:w-full">
              <div className="flex items-center justify-center py-8 sm:order-2 sm:flex-1">
                <div className="text-center text-lg">
                  <h5 className="mb-4 text-2xl font-bold">{show.movie.title}</h5>
                  <p>{formatTime(show.movie.durationInMins)}</p>
                  <p>Released {format(show.movie.releaseDate, "MMM d, yyyy")}</p>
                  <p>
                    {format(show.startTime, "hh:mm a")} - {format(show.endTime, "hh:mm a")}
                  </p>
                </div>
              </div>

              <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden sm:order-1">
                <Image
                  src={show.movie.posterUrl}
                  alt={`Current Showing Movie (${show.movie.title})`}
                  width={200}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>Currently, there is no show.</div>
        )}
      </section>
    </>
  )
}

export default NowPlaying
