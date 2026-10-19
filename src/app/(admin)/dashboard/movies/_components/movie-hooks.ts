import { movieSchema } from "@/validators/movie"
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, useForm } from "react-hook-form"
import { z } from "zod"

export type MovieFormInput = z.input<typeof movieSchema>
export type MovieFormOutput = z.output<typeof movieSchema>

export const useMovieForm = (defaultValues?: DefaultValues<MovieFormOutput>) =>
  useForm<MovieFormInput, unknown, MovieFormOutput>({
    resolver: zodResolver(movieSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      posterUrl: "",
      genre: "",
      durationInMins: 0,
    },
  })
