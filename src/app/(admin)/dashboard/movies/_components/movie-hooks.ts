import { TMovie } from "@/types/movie"
import { movieSchema } from "@/validators/movie"
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, useForm } from "react-hook-form"

export const useMovieForm = (defaultValues?: DefaultValues<TMovie>) =>
  useForm<TMovie>({
    resolver: zodResolver(movieSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      genre: "",
      durationInMins: 0,
    },
  })
