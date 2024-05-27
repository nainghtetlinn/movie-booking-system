"use server"

import resend from "@/configs/resend"
import ListBookings from "emails/list-bookings"
import db from "prisma/db"

export async function listTicekts(email: string) {
  const bookings = await db.booking.findMany({
    where: { email },
    include: {
      tickets: {
        include: {
          show: {
            include: {
              movie: true,
            },
          },
          seat: true,
        },
      },
    },
  })

  await resend.emails.send({
    from: process.env.RESEND_DOMAIN!,
    to: email,
    subject: "Your bookings list.",
    react: ListBookings({ bookings }),
  })

  return
}
