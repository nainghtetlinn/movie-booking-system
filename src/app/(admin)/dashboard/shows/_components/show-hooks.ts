import { TShow } from "@/types/show"
import { showSchema } from "@/validators/show"
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, useForm } from "react-hook-form"

export const useShowForm = (defaultValues?: DefaultValues<TShow>) =>
  useForm<TShow>({
    resolver: zodResolver(showSchema),
    defaultValues: defaultValues ?? {
      movieId: "",
    },
  })
