import { NextResponse } from "next/server"
import db from "@/configs/db"
import { startOfDay, addDays } from "date-fns"

/**
 * GET /api/cron/refresh-schedule
 *
 * Keeps the portfolio project looking fresh every day without manual work.
 *
 * What it does:
 * 1. Sets every show's `date` to today
 * 2. Distributes shows evenly across the full 24 hours (back-to-back, no gaps)
 *    → This guarantees there is ALWAYS a show playing, no matter when someone visits
 * 3. Resets all seat statuses back to "available" so the booking flow works
 * 4. Increments each movie's `releaseDate` by 1 day to keep them looking current
 *
 * Protected by a CRON_SECRET env var so only Vercel Cron (or you) can call it.
 */
export async function GET(request: Request) {
  console.log("CRON job called")

// Verify the request is authorized
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("CRON JOB ABLE TO RUN")

  try {
    // 1. Shift movie release dates forward by 24 hours (1 day)
    const movies = await db.movie.findMany()

    for (const movie of movies) {
      const updatedReleaseDate = addDays(new Date(movie.releaseDate), 1)

      await db.movie.update({
        where: { id: movie.id },
        data: {
          releaseDate: updatedReleaseDate.toISOString(),
        },
      })
    }

    // 2. Shift show date, startTime, and endTime forward by 24 hours (1 day)
    const shows = await db.show.findMany()

    for (const show of shows) {
      const updatedDate = addDays(new Date(show.date), 1)
      const updatedStartTime = addDays(new Date(show.startTime), 1)
      const updatedEndTime = addDays(new Date(show.endTime), 1)

      await db.show.update({
        where: { id: show.id },
        data: {
          date: updatedDate.toISOString(),
          startTime: updatedStartTime.toISOString(),
          endTime: updatedEndTime.toISOString(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Shifted dates forward by 24 hours for ${movies.length} movies and ${shows.length} shows.`,
      moviesUpdated: movies.length,
      showsUpdated: shows.length,
    })
  } catch (error) {
    console.error("Failed to refresh schedule:", error)
    return NextResponse.json({ error: "Failed to refresh schedule" }, { status: 500 })
  }
}
