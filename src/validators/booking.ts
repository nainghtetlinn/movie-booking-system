import { z } from "zod"

export const bookingClientSchema = z.object({
  movieId: z.string(),
  showtimeId: z.string(),
  seatIds: z.array(z.string()).min(1),
})
