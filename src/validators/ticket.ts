import { z } from "zod"

export const ticketsSchema = z.object({
  email: z.string().email(),
})
