import { z } from "zod"
import { movieSchema } from "@/validators/movie"

export type TMovie = z.infer<typeof movieSchema>
