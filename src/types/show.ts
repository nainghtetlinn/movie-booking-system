import { z } from "zod"
import { showSchema } from "@/validators/show"
import { Prisma } from "@prisma/client"

export type TShow = z.infer<typeof showSchema>

export type TShowTable = Prisma.ShowGetPayload<{
  include: {
    movie: {
      select: {
        title: true
      }
    }
    _count: {
      select: { tickets: true }
    }
  }
}>
