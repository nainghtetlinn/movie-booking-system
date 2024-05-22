import { z } from "zod"

export const bookingClientSchema = z.object({
  movieId: z.string().min(1, "Please select a movie."),
  showId: z.string().min(1, "Please select a show."),
  seatIds: z.array(z.string()).min(1, "Please choose at least one seat for booking."),
  email: z.string().email(),
})
