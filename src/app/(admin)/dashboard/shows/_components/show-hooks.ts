import { showSchema } from "@/validators/show"
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, useForm } from "react-hook-form"
import { z } from "zod"

export type ShowFormInput = z.input<typeof showSchema>
export type ShowFormOutput = z.output<typeof showSchema>

export const useShowForm = (defaultValues?: DefaultValues<ShowFormOutput>) =>
  useForm<ShowFormInput, unknown, ShowFormOutput>({
    resolver: zodResolver(showSchema),
    defaultValues: defaultValues ?? {
      movieId: "",
    },
  })
