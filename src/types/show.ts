import { showSchema } from "@/validators/show"
import { Prisma } from "@prisma/client"
import { z } from "zod"

export type TShow = z.infer<typeof showSchema>

export type TShowTableItem = Prisma.ShowGetPayload<{
  include: {
    movie: {
      select: {
        title: true
        posterUrl: true
      }
    }
    _count: {
      select: { tickets: true }
    }
  }
}>

export type TShowMovieOptions = Prisma.MovieGetPayload<{ select: { id: true; title: true } }>[]
