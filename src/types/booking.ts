import { z } from "zod"
import { bookingClientSchema } from "@/validators/booking"
import { Prisma } from "@prisma/client"

export type TBookingClient = z.infer<typeof bookingClientSchema>

export type TBookingTableItem = Prisma.BookingGetPayload<{
  include: {
    tickets: {
      include: {
        seat: {
          select: {
            class: true
            row: true
            number: true
          }
        }
        show: {
          include: {
            movie: {
              select: {
                title: true
              }
            }
          }
        }
      }
    }
  }
}>
