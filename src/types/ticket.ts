import { z } from "zod"
import { ticketsSchema } from "@/validators/ticket"

export type TTickets = z.infer<typeof ticketsSchema>
