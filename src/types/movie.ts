import { movieSchema } from "@/validators/movie"
import { Prisma } from "@prisma/client"
import { z } from "zod"

export type TMovie = z.infer<typeof movieSchema>

export type TMovieTableItem = Prisma.MovieGetPayload<{
  include: {
    _count: {
      select: { shows: true }
    }
  }
}>
