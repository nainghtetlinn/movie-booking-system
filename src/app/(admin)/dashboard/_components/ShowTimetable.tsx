"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, Film, Ticket, CalendarClock } from "lucide-react"
import { format, differenceInMinutes, isAfter, isBefore, startOfHour, addHours } from "date-fns"
import Image from "next/image"
import type { TodayShow } from "@/server-actions/todayShows"

interface Props {
  shows: TodayShow[]
}

/** Color palette for movie bars — cycles if there are more shows than colors */
const COLORS = [
  {
    bg: "bg-blue-500/20",
    border: "border-blue-500/40",
    text: "text-blue-400",
    bar: "bg-blue-500",
    dot: "bg-blue-400",
  },
  {
    bg: "bg-purple-500/20",
    border: "border-purple-500/40",
    text: "text-purple-400",
    bar: "bg-purple-500",
    dot: "bg-purple-400",
  },
  {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    bar: "bg-emerald-500",
    dot: "bg-emerald-400",
  },
  {
    bg: "bg-amber-500/20",
    border: "border-amber-500/40",
    text: "text-amber-400",
    bar: "bg-amber-500",
    dot: "bg-amber-400",
  },
  {
    bg: "bg-rose-500/20",
    border: "border-rose-500/40",
    text: "text-rose-400",
    bar: "bg-rose-500",
    dot: "bg-rose-400",
  },
  {
    bg: "bg-cyan-500/20",
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    bar: "bg-cyan-500",
    dot: "bg-cyan-400",
  },
  {
    bg: "bg-pink-500/20",
    border: "border-pink-500/40",
    text: "text-pink-400",
    bar: "bg-pink-500",
    dot: "bg-pink-400",
  },
  {
    bg: "bg-indigo-500/20",
    border: "border-indigo-500/40",
    text: "text-indigo-400",
    bar: "bg-indigo-500",
    dot: "bg-indigo-400",
  },
]

function getShowStatus(show: TodayShow) {
  const now = new Date()
  if (isBefore(now, new Date(show.startTime))) return "upcoming"
  if (isAfter(now, new Date(show.endTime))) return "ended"
  return "live"
}

function getStatusBadge(status: string) {
  switch (status) {
    case "live":
      return (
        <Badge className="animate-pulse border-none bg-green-500/20 text-green-400">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
          Live Now
        </Badge>
      )
    case "upcoming":
      return (
        <Badge variant="secondary" className="border-none bg-blue-500/20 text-blue-400">
          <CalendarClock className="mr-1 h-3 w-3" />
          Upcoming
        </Badge>
      )
    case "ended":
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
          Ended
        </Badge>
      )
  }
}

const ShowTimetable = ({ shows }: Props) => {
  if (shows.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground flex flex-col items-center justify-center py-12">
          <Film className="mb-3 h-12 w-12 opacity-40" />
          <p className="text-lg font-medium">No shows scheduled for today</p>
          <p className="text-sm">Shows will appear here when they are scheduled.</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate the timeline range — from earliest start to latest end
  const allStartTimes = shows.map((s) => new Date(s.startTime).getTime())
  const allEndTimes = shows.map((s) => new Date(s.endTime).getTime())

  // Snap to hour boundaries for cleaner labels
  const timelineStart = startOfHour(new Date(Math.min(...allStartTimes)))
  const timelineEnd = addHours(startOfHour(new Date(Math.max(...allEndTimes))), 1)

  const totalMinutes = differenceInMinutes(timelineEnd, timelineStart)

  // Generate hour markers
  const hourMarkers: Date[] = []
  let cursor = new Date(timelineStart)
  while (cursor <= timelineEnd) {
    hourMarkers.push(new Date(cursor))
    cursor = addHours(cursor, 1)
  }

  // Group shows by movie for the timeline view
  const movieGroups = new Map<string, TodayShow[]>()
  shows.forEach((show) => {
    const key = show.movie.title
    if (!movieGroups.has(key)) movieGroups.set(key, [])
    movieGroups.get(key)!.push(show)
  })

  const now = new Date()
  const nowOffset =
    now >= timelineStart && now <= timelineEnd
      ? (differenceInMinutes(now, timelineStart) / totalMinutes) * 100
      : null

  return (
    <div className="space-y-6">
      {/* ---- Timeline Chart ---- */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-5 w-5" />
            <h3 className="text-lg font-semibold">Showtime Timeline</h3>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[600px] pr-4">
            {/* Hour labels (offset by w-28 + gap-3 to match the bar tracks) */}
            <div className="mb-1 flex items-end gap-3">
              <div className="w-28 shrink-0" />
              <div className="relative h-6 flex-1">
                {hourMarkers.map((hour, i) => {
                  const left = (differenceInMinutes(hour, timelineStart) / totalMinutes) * 100
                  return (
                    <span
                      key={i}
                      className="text-muted-foreground absolute bottom-0 -translate-x-1/2 text-[11px] whitespace-nowrap"
                      style={{ left: `${left}%` }}>
                      {format(hour, "h a")}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Grid lines + bars */}
            <div className="relative">
              {/* Vertical grid lines & Current-time indicator (offset by w-28 + gap-3) */}
              <div className="pointer-events-none absolute inset-0 flex gap-3">
                <div className="w-28 shrink-0" />
                <div className="relative h-full flex-1">
                  {hourMarkers.map((hour, i) => {
                    const left = (differenceInMinutes(hour, timelineStart) / totalMinutes) * 100
                    return (
                      <div
                        key={i}
                        className="border-muted-foreground/15 absolute top-0 h-full border-l border-dashed"
                        style={{ left: `${left}%` }}
                      />
                    )
                  })}

                  {/* Current-time indicator */}
                  {nowOffset !== null && (
                    <div
                      className="absolute top-0 z-20 h-full w-px bg-red-500"
                      style={{ left: `${nowOffset}%` }}>
                      <div className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-red-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Movie rows */}
              <TooltipProvider delayDuration={100}>
                <div className="space-y-2 py-2">
                  {Array.from(movieGroups.entries()).map(([title, movieShows], groupIdx) => {
                    const color = COLORS[groupIdx % COLORS.length]
                    return (
                      <div key={title} className="flex items-center gap-3">
                        {/* Movie label */}
                        <div
                          className="w-28 shrink-0 truncate text-right text-sm font-medium"
                          title={title}>
                          {title}
                        </div>

                        {/* Bar track */}
                        <div className="bg-muted/40 relative h-9 flex-1 rounded-md">
                          {movieShows.map((show) => {
                            const startPct =
                              (differenceInMinutes(new Date(show.startTime), timelineStart) /
                                totalMinutes) *
                              100
                            const widthPct =
                              (differenceInMinutes(
                                new Date(show.endTime),
                                new Date(show.startTime),
                              ) /
                                totalMinutes) *
                              100
                            const status = getShowStatus(show)

                            return (
                              <Tooltip key={show.id}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`absolute top-1 bottom-1 rounded-md border ${color.bg} ${color.border} flex cursor-pointer items-center justify-center overflow-hidden px-2 transition-all hover:brightness-125 ${status === "live" ? "ring-1 ring-green-400/50" : ""}`}
                                    style={{
                                      left: `${startPct}%`,
                                      width: `${Math.max(widthPct, 2)}%`,
                                    }}>
                                    <span className={`truncate text-xs font-medium ${color.text}`}>
                                      {format(new Date(show.startTime), "h:mm a")}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="space-y-1 text-sm">
                                    <p className="font-semibold">{title}</p>
                                    <p>
                                      {format(new Date(show.startTime), "hh:mm a")} –{" "}
                                      {format(new Date(show.endTime), "hh:mm a")}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {show._count.tickets} tickets sold
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Show Cards Grid ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shows.map((show) => {
          const color =
            COLORS[Array.from(movieGroups.keys()).indexOf(show.movie.title) % COLORS.length]
          const status = getShowStatus(show)
          const duration = differenceInMinutes(new Date(show.endTime), new Date(show.startTime))

          return (
            <Card
              key={show.id}
              className={`overflow-hidden transition-shadow hover:shadow-md ${status === "live" ? "ring-1 ring-green-500/30" : ""}`}>
              {/* Poster header */}
              <div className="bg-muted relative h-32 w-full overflow-hidden">
                <Image
                  src={show.movie.posterUrl}
                  alt={`Poster of ${show.movie.title}`}
                  fill
                  className="object-cover opacity-60"
                />
                <div className="from-card via-card/60 absolute inset-0 bg-gradient-to-t to-transparent" />
                <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between">
                  <h4 className="truncate text-sm font-bold">{show.movie.title}</h4>
                  {getStatusBadge(status)}
                </div>
              </div>

              <CardContent className="space-y-3 p-4">
                {/* Time block */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${color.bg}`}>
                    <Clock className={`h-4 w-4 ${color.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {format(new Date(show.startTime), "hh:mm a")} –{" "}
                      {format(new Date(show.endTime), "hh:mm a")}
                    </p>
                    <p className="text-muted-foreground text-xs">{duration} min</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="text-muted-foreground flex items-center gap-4 border-t pt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Film className="h-3.5 w-3.5" />
                    <span>{show.movie.genre}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-3.5 w-3.5" />
                    <span>{show._count.tickets} sold</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ShowTimetable
