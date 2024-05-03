import { z } from "zod"
import { movieSchema } from "@/validators/movie"
import { Prisma } from "@prisma/client"

export type TMovie = z.infer<typeof movieSchema>

export type TMovieTable = Prisma.MovieGetPayload<{
  include: {
    _count: true
  }
}>
