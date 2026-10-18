"use server"

import db from "@/configs/db"

import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

export const fetchDashboardData = async (range: "day" | "week" | "month" | string) => {
  const now = new Date()
  let start: Date
  let end: Date

  if (range === "week") {
    start = startOfWeek(now)
    end = endOfWeek(now)
  } else if (range === "month") {
    start = startOfMonth(now)
    end = endOfMonth(now)
  } else {
    start = startOfDay(now)
    end = endOfDay(now)
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
