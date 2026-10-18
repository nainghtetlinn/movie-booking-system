import { NextResponse } from "next/server"
import db from "@/configs/db"
import { startOfDay } from "date-fns"

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
    const shows = await db.show.findMany({
      include: { movie: { select: { durationInMins: true } } },
      orderBy: { startTime: "asc" },
    })

    if (shows.length === 0) {
      return NextResponse.json({ message: "No shows found. Nothing to refresh." })
    }

    const today = startOfDay(new Date())
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

    let updated = 0
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
      updated++
    }

    // Reset all seat statuses so booking flow works fresh each day
    await db.showSeatRelation.updateMany({
      data: { status: "available" },
    })

    return NextResponse.json({
      message: `Refreshed ${updated} shows. Distributed across 24 hours with no gaps.`,
      showsUpdated: updated,
      scaleFactor: Math.round(scale * 100) / 100,
    })
  } catch (error) {
    console.error("Failed to refresh schedule:", error)
    return NextResponse.json({ error: "Failed to refresh schedule" }, { status: 500 })
  }
}

