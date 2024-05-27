import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table"
import TitleTypography from "@/components/TitleTypography"

import { Prisma } from "@prisma/client"
import Image from "next/image"
import { format } from "date-fns"

interface Props {
  shows: Prisma.ShowGetPayload<{ include: { movie: true } }>[]
}

const TodayShows = ({ shows }: Props) => {
  return (
    <section className="mb-12">
      <div className="container">
        <TitleTypography>Today Shows</TitleTypography>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Genre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shows.map((show) => (
              <TableRow key={show.id}>
                <TableCell>
                  <Image
                    src={show.movie.posterUrl}
                    alt={`Poster of ${show.movie.title}`}
                    width={80}
                    height={160}
                  />
                </TableCell>
                <TableCell>{show.movie.title}</TableCell>
                <TableCell>{`${format(show.startTime, "hh:mm a")} - ${format(show.endTime, "hh:mm a")}`}</TableCell>
                <TableCell>{show.movie.genre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export default TodayShows
