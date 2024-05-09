import { z } from "zod"

export const bookingClientSchema = z.object({
  movieId: z.string().min(1),
  showId: z.string().min(1),
  seatIds: z.array(z.string()).min(1, "Please choose at least one seat for booking."),
})
