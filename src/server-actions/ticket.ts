"use server"

import { Resend } from "resend"
import db from "prisma/db"
import ListBookings from "emails/list-bookings"

const resend = new Resend(process.env.RESEND_API_KEY!)

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
