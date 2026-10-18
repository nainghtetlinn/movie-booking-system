"use server"

import db from "@/configs/db"
import { startOfDay, endOfDay } from "date-fns"

export async function fetchTodayActiveShows() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  return await db.show.findMany({
    where: {
      date: {
        gte: todayStart.toISOString(),
        lte: todayEnd.toISOString(),
      },
    },
    include: {
      movie: {
        select: {
          title: true,
          posterUrl: true,
          genre: true,
          durationInMins: true,
        },
      },
      _count: {
        select: { tickets: true },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  })
}

export type TodayShow = Awaited<ReturnType<typeof fetchTodayActiveShows>>[number]

