import TitleTypography from "@/components/TitleTypography"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

import { formatTime } from "@/lib/utils"
import { Prisma } from "@/generated/prisma/client"
import { format } from "date-fns"
import { Film } from "lucide-react"

interface Props {
  show: Prisma.ShowGetPayload<{ include: { movie: true } }> | null
}

const NowPlaying = ({ show }: Props) => {
  return (
    <>
      <section className="container mb-16">
        <TitleTypography>Now Playing</TitleTypography>

        {show ? (
          <div className="flex justify-center">
            <div className="w-[300px] overflow-hidden rounded-2xl border border-primary/20 bg-secondary shadow-lg shadow-primary/5 sm:flex sm:w-full sm:max-w-3xl">
              <div className="flex items-center justify-center py-10 sm:order-2 sm:flex-1 sm:px-8">
                <div className="space-y-3 text-center sm:text-left">
                  <Badge variant="default" className="mb-2">
                    <span className="relative mr-2 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
                    </span>
                    Live Now
                  </Badge>
                  <h5 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {show.movie.title}
                  </h5>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{formatTime(show.movie.durationInMins)}</p>
                    <p>Released {format(show.movie.releaseDate, "MMM d, yyyy")}</p>
                    <p className="text-base font-medium text-foreground">
                      {format(show.startTime, "hh:mm a")} – {format(show.endTime, "hh:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden sm:order-1">
                <Image
                  src={show.movie.posterUrl}
                  alt={`Current Showing Movie (${show.movie.title})`}
                  width={300}
                  height={450}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/25 py-16 text-center">
            <Film className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No show is playing right now.</p>
          </div>
        )}
      </section>
    </>
  )
}

export default NowPlaying
