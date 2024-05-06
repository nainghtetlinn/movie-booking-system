import { z } from "zod"

export const movieSchema = z.object({
  title: z.string().min(1, "Title required."),
  description: z.string().min(1, "Description required."),
  posterUrl: z.string().min(1, "Poster url required."),
  durationInMins: z.coerce.number().gt(0, "Duration must be greater than 0."),
  releaseDate: z.coerce.date(),
  genre: z.string(),
})
