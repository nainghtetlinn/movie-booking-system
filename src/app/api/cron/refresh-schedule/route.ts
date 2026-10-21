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
  // Verify the request is authorized
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const today = startOfDay(new Date())

    // 1. Refresh all movies: Shift their releaseDate forward by 1 day
    // We can fetch unique movies linked to shows or update all movies in your catalog
    const movies = await db.movie.findMany()

    for (const movie of movies) {
      const currentReleaseDate = new Date(movie.releaseDate)
      const newReleaseDate = addDays(currentReleaseDate, 1)

      await db.movie.update({
        where: { id: movie.id },
        data: {
          releaseDate: newReleaseDate.toISOString(),
        },
      })
    }

    // 2. Fetch and redistribute shows
    const shows = await db.show.findMany({
      include: { movie: { select: { durationInMins: true } } },
      orderBy: { startTime: "asc" },
    })

    if (shows.length === 0) {
      return NextResponse.json({
        message: `Updated ${movies.length} movies' release dates, but no shows found to refresh.`,
      })
    }

    const MINUTES_IN_DAY = 24 * 60

    // Calculate each show's real duration from its movie (fallback: original show duration)
    const showDurations = shows.map((show) => {
      if (show.movie.durationInMins > 0) return show.movie.durationInMins
      // Fallback: derive from original startTime/endTime
      const diffMs = new Date(show.endTime).getTime() - new Date(show.startTime).getTime()
      return Math.max(Math.round(diffMs / 60000), 30) // at least 30 min
    })

    const totalDuration = showDurations.reduce((sum, d) => sum + d, 0)

    // Scale factor: stretch or compress so all shows fill exactly 24 hours
    const scale = MINUTES_IN_DAY / totalDuration

    let cursor = new Date(today) // starts at midnight

    let updatedShows = 0
    for (let i = 0; i < shows.length; i++) {
      const show = shows[i]
      const slotMinutes = showDurations[i] * scale

      const newStartTime = new Date(cursor)
      const newEndTime = new Date(cursor.getTime() + slotMinutes * 60000)

      // Move cursor to the end of this slot (no gap)
      cursor = newEndTime

      await db.show.update({
        where: { id: show.id },
        data: {
          date: today.toISOString(),
          startTime: newStartTime.toISOString(),
          endTime: newEndTime.toISOString(),
        },
      })
      updatedShows++
    }

    // 3. Reset all seat statuses so booking flow works fresh each day
    await db.showSeatRelation.updateMany({
      data: { status: "available" },
    })

    return NextResponse.json({
      message: `Refreshed ${movies.length} movies and ${updatedShows} shows. Distributed across 24 hours with no gaps.`,
      moviesUpdated: movies.length,
      showsUpdated: updatedShows,
      scaleFactor: Math.round(scale * 100) / 100,
    })
  } catch (error) {
    console.error("Failed to refresh schedule:", error)
    return NextResponse.json({ error: "Failed to refresh schedule" }, { status: 500 })
  }
}
