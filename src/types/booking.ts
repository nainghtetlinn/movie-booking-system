import { z } from "zod"
import { bookingClientSchema } from "@/validators/booking"

export type TBookingClient = z.infer<typeof bookingClientSchema>
