import { useContext } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { bookingClientSchema } from "@/validators/booking"
import { TBookingClient } from "@/types/booking"
import BookingContext from "./booking-context"

export const useBooking = () => {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error("useBooking must be used within a <BookingProvider />")
  }

  return context
}

export const useBookingForm = () =>
  useForm<TBookingClient>({ resolver: zodResolver(bookingClientSchema) })

export const useBookingFormContext = () => useFormContext<TBookingClient>()
