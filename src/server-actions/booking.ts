"use server"

import { checkPermission } from "@/configs/auth"
import resend from "@/configs/resend"
import { bookingClientSchema } from "@/validators/booking"
import { Prisma } from "@prisma/client"
import SuccessBooking from "emails/success-booking"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import db from "@/configs/db"

export async function getMovies() {
  return await db.movie.findMany({
    select: { id: true, title: true, posterUrl: true, durationInMins: true },
  })
}

export async function getShows(movieId: string) {
  return await db.show.findMany({
    where: {
      movieId,
    },
    orderBy: { startTime: "asc" },
  })
}

export async function getSeats(showId: string) {
  return await db.seat.findMany({
    include: {
      showSeatRelation: {
        where: {
          showId,
        },
      },
    },
  })
}

export async function getCheckout({
  movieId,
  showId,
  seatIds,
}: {
  movieId: string
  showId: string
  seatIds: string[]
}) {
  const movie = await db.movie.findUnique({ where: { id: movieId } })
  const show = await db.show.findUnique({ where: { id: showId, movieId } })
  const seats = await db.seat.findMany({
    where: { id: { in: seatIds } },
  })

  return { movie, show, seats }
}

export async function makeBooking(data: {
  movieId: string
  showId: string
  seatIds: string[]
  email: string
}) {
  const { movieId, showId, seatIds, email } = bookingClientSchema.parse(data)

  const movie = await db.movie.findUnique({ where: { id: movieId } })
  const show = await db.show.findUnique({ where: { id: showId, movieId } })
  const seats = await db.seat.findMany({
    where: { id: { in: seatIds }, showSeatRelation: { some: { showId, status: "available" } } },
  })

  if (!movie || !show || seats.length === 0 || seats.length !== seatIds.length)
    throw new Error("Something went wrong.")

  // initialize booking
  const booking = await db.booking.create({ data: { email, totalAmount: 0 } })

  // create ticket for each seat
  let totalAmount = 0
  let tickets: Prisma.TicketCreateManyInput[] = []
  seats.forEach((s) => {
    totalAmount += s.price
    tickets.push({ amount: s.price, bookingId: booking.id, showId: show.id, seatId: s.id })
  })
  await db.ticket.createMany({ data: tickets })

  // update booking total amount
  const updatedBooking = await db.booking.update({
    where: { id: booking.id },
    data: { totalAmount },
  })

  // update seat status
  await db.showSeatRelation.updateMany({
    where: { showId: show.id, seatId: { in: seatIds } },
    data: { status: "purchased" },
  })

  redirect("/success?bookingId=" + updatedBooking.id)
}

export async function deleteBooking(id: string) {
  const isAllow = await checkPermission()
  if (!isAllow) return { success: false, message: "Permission denied." }

  try {
    // find tickets
    const tickets = await db.ticket.findMany({ where: { bookingId: id } })
    const seatIds = tickets.map((t) => t.seatId)
    const showId = tickets[0].showId

    // set status available to all seats related to show
    await db.showSeatRelation.updateMany({
      where: { showId, seatId: { in: seatIds } },
      data: { status: "available" },
    })

    // delete tickets
    await db.ticket.deleteMany({ where: { bookingId: id } })

    // delete booking
    const booking = await db.booking.delete({ where: { id } })
    revalidatePath("/dashboard/bookings")
    return { success: true, data: booking.id }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export async function paid(bookingId: string) {
  const booking = await db.booking.findUnique({ where: { id: bookingId } })
  if (!booking || booking.status === "paid") return

  const updatedBooking = await db.booking.update({
    where: { id: bookingId },
    data: { status: "paid" },
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
    to: updatedBooking.email,
    subject: "Thanks for your booking.",
    react: SuccessBooking({ booking: updatedBooking }),
  })

  revalidatePath("/success?bookingId=" + bookingId)
}

export const fetchDashboardBookings = async (filter: "all" | "paid" | "unpaid") => {
  let where = {}

  if (filter === "paid") where = { status: "paid" }
  else if (filter === "unpaid") where = { status: "unpaid" }

  return await db.booking.findMany({
    include: {
      tickets: {
        include: {
          seat: {
            select: {
              class: true,
              row: true,
              number: true,
            },
          },
          show: {
            include: {
              movie: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
    where,
    orderBy: {
      createdAt: "desc",
    },
  })
}
