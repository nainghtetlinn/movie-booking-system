import { useForm, useFormContext, DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { bookingClientSchema } from "@/validators/booking"
import { TBookingClient } from "@/types/booking"

export const useBookingForm = (defaultValues?: DefaultValues<TBookingClient>) =>
  useForm<TBookingClient>({
    resolver: zodResolver(bookingClientSchema),
    defaultValues: defaultValues ? defaultValues : {},
  })

export const useBookingFormContext = () => useFormContext<TBookingClient>()
