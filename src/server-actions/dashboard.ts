"use server"

import db from "prisma/db"

export const fetchDashboardData = async (range: "day" | "week" | "month" | string) => {
  let start = new Date(2024, 5, 2)
  let end = new Date(2024, 5, 3)

  if (range === "week") {
    let dayOfWeek = start.getDay()

    let startOfWeek = new Date(start)
    startOfWeek.setDate(start.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)

    let endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    start = startOfWeek
    end = endOfWeek
  } else if (range === "month") {
    start = new Date(2024, 5, 1)
    end = new Date(2024, 6, 0)
  }

  const bookings = await db.booking.findMany({
    where: {
      createdAt: { gte: start.toISOString(), lte: end.toISOString() },
    },
    select: { totalAmount: true },
  })
  const sales = bookings.reduce((total, b) => total + b.totalAmount, 0)
  const totalBookings = await db.booking.findMany({ select: { totalAmount: true } })
  const totalSales = totalBookings.reduce((total, b) => total + b.totalAmount, 0)

  const tickets = await db.ticket.count({
    where: {
      createdAt: { gte: start.toISOString(), lte: end.toISOString() },
    },
  })
  const totalTickets = await db.ticket.count()

  const movies = await db.movie.count({
    where: {
      releaseDate: { gte: start.toISOString(), lte: end.toISOString() },
    },
  })
  const totalMovies = await db.movie.count()

  const shows = await db.show.count({
    where: { date: { gte: start.toISOString(), lte: end.toISOString() } },
  })
  const totalShows = await db.show.count()

  return { sales, totalSales, tickets, totalTickets, movies, totalMovies, shows, totalShows }
}
