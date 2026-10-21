"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import DatePicker from "@/components/DatePicker"
import { Badge } from "@/components/ui/badge"
import { Clock, Film, GripHorizontal, Loader2, Plus, Save, Trash2, X } from "lucide-react"
import { addMinutes, differenceInMinutes, format, startOfDay } from "date-fns"
import { TShowMovieOptions, TShowTableItem } from "@/types/show"
import { createShow, fetchShowsByDate } from "@/server-actions/show"
import { toast } from "sonner"

/** Color palette for movie bars */
const COLORS = [
  { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400", solid: "bg-blue-500" },
  { bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-400", solid: "bg-purple-500" },
  { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", solid: "bg-emerald-500" },
  { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", solid: "bg-amber-500" },
  { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", solid: "bg-rose-500" },
  { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400", solid: "bg-cyan-500" },
  { bg: "bg-pink-500/20", border: "border-pink-500/40", text: "text-pink-400", solid: "bg-pink-500" },
  { bg: "bg-indigo-500/20", border: "border-indigo-500/40", text: "text-indigo-400", solid: "bg-indigo-500" },
]

// Timeline constants
const TIMELINE_START_HOUR = 6 // 6 AM
const TIMELINE_END_HOUR = 24 // 12 AM (midnight)
const TOTAL_TIMELINE_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60
const SNAP_MINUTES = 5 // snap to 5 minute intervals

type PendingShow = {
  id: string
  movieId: string
  movieTitle: string
  durationInMins: number
  startMinutes: number // minutes from timeline start
  endMinutes: number // minutes from timeline start
}

type DragState = {
  type: "move" | "resize-start" | "resize-end"
  showId: string
  startX: number
  originalStartMinutes: number
  originalEndMinutes: number
}

interface ShowTimelineProps {
  movies: TShowMovieOptions
  existingShows: TShowTableItem[]
}

const ShowTimeline = ({ movies, existingShows: initialShows }: ShowTimelineProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()))
  const [selectedMovieId, setSelectedMovieId] = useState<string>("")
  const [pendingShows, setPendingShows] = useState<PendingShow[]>([])
  const [existingShows, setExistingShows] = useState<TShowTableItem[]>(initialShows)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Movie color mapping (consistent per movie title)
  const movieColorMap = useMemo(() => {
    const map = new Map<string, number>()
    const allTitles = new Set<string>()
    existingShows.forEach((s) => allTitles.add(s.movie.title))
    pendingShows.forEach((s) => allTitles.add(s.movieTitle))
    movies.forEach((m) => allTitles.add(m.title))
    let idx = 0
    allTitles.forEach((title) => {
      map.set(title, idx % COLORS.length)
      idx++
    })
    return map
  }, [existingShows, pendingShows, movies])

  // Fetch shows when date changes
  const fetchShows = useCallback(async (date: Date) => {
    setLoading(true)
    try {
      const shows = await fetchShowsByDate(date)
      setExistingShows(shows)
    } catch {
      toast.error("Failed to fetch shows")
    }
    setLoading(false)
  }, [])

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return
    const newDate = startOfDay(date)
    setSelectedDate(newDate)
    setPendingShows([])
    fetchShows(newDate)
  }

  // Generate hour markers
  const hourMarkers = useMemo(() => {
    const markers: number[] = []
    for (let h = TIMELINE_START_HOUR; h <= TIMELINE_END_HOUR; h++) {
      markers.push(h)
    }
    return markers
  }, [])

  // Convert minutes from timeline start to percentage
  const minutesToPercent = (minutes: number) => {
    return (minutes / TOTAL_TIMELINE_MINUTES) * 100
  }

  // Convert client x position to minutes from timeline start
  const xToMinutes = (clientX: number): number => {
    if (!timelineRef.current) return 0
    const rect = timelineRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left
    const pct = relativeX / rect.width
    const minutes = pct * TOTAL_TIMELINE_MINUTES
    // Snap to SNAP_MINUTES
    return Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES
  }

  // Convert show times to minutes from timeline start
  const showToTimelineMinutes = (startTime: Date, endTime: Date) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const startMins = (start.getHours() - TIMELINE_START_HOUR) * 60 + start.getMinutes()
    const endMins = (end.getHours() - TIMELINE_START_HOUR) * 60 + end.getMinutes()
    return { startMins, endMins }
  }

  // Convert timeline minutes to actual time string
  const timelineMinutesToTimeStr = (minutes: number): string => {
    const totalMinutes = TIMELINE_START_HOUR * 60 + minutes
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    const h12 = hours % 12 || 12
    const ampm = hours < 12 ? "AM" : "PM"
    return `${h12}:${mins.toString().padStart(2, "0")} ${ampm}`
  }

  // Check for overlap with existing or pending shows
  const checkOverlap = (startMins: number, endMins: number, excludeId?: string): boolean => {
    // Check existing shows
    for (const show of existingShows) {
      const { startMins: exStart, endMins: exEnd } = showToTimelineMinutes(
        show.startTime,
        show.endTime,
      )
      if (startMins < exEnd && endMins > exStart) return true
    }
    // Check pending shows
    for (const show of pendingShows) {
      if (show.id === excludeId) continue
      if (startMins < show.endMinutes && endMins > show.startMinutes) return true
    }
    return false
  }

  // Handle clicking on the timeline to place a show
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedMovieId || dragState) return

    const movie = movies.find((m) => m.id === selectedMovieId)
    if (!movie) return

    const clickMinutes = xToMinutes(e.clientX)
    const duration = movie.durationInMins || 120
    const startMinutes = Math.max(0, clickMinutes)
    const endMinutes = Math.min(TOTAL_TIMELINE_MINUTES, startMinutes + duration)

    // Check overlap
    if (checkOverlap(startMinutes, endMinutes)) {
      toast.error("This time slot overlaps with an existing show")
      return
    }

    const newShow: PendingShow = {
      id: crypto.randomUUID(),
      movieId: movie.id,
      movieTitle: movie.title,
      durationInMins: duration,
      startMinutes,
      endMinutes,
    }

    setPendingShows((prev) => [...prev, newShow])
  }

  // Remove a pending show
  const removePendingShow = (id: string) => {
    setPendingShows((prev) => prev.filter((s) => s.id !== id))
  }

  // Drag handling for move and resize
  const handleMouseDown = (
    e: React.MouseEvent,
    type: DragState["type"],
    show: PendingShow,
  ) => {
    e.stopPropagation()
    e.preventDefault()
    setDragState({
      type,
      showId: show.id,
      startX: e.clientX,
      originalStartMinutes: show.startMinutes,
      originalEndMinutes: show.endMinutes,
    })
  }

  useEffect(() => {
    if (!dragState) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return
      const rect = timelineRef.current.getBoundingClientRect()
      const deltaX = e.clientX - dragState.startX
      const deltaMinutes =
        Math.round((deltaX / rect.width) * TOTAL_TIMELINE_MINUTES / SNAP_MINUTES) * SNAP_MINUTES

      setPendingShows((prev) =>
        prev.map((show) => {
          if (show.id !== dragState.showId) return show

          let newStart = show.startMinutes
          let newEnd = show.endMinutes

          if (dragState.type === "move") {
            newStart = dragState.originalStartMinutes + deltaMinutes
            newEnd = dragState.originalEndMinutes + deltaMinutes
            // Clamp
            if (newStart < 0) {
              newEnd -= newStart
              newStart = 0
            }
            if (newEnd > TOTAL_TIMELINE_MINUTES) {
              newStart -= newEnd - TOTAL_TIMELINE_MINUTES
              newEnd = TOTAL_TIMELINE_MINUTES
            }
          } else if (dragState.type === "resize-start") {
            newStart = Math.max(0, dragState.originalStartMinutes + deltaMinutes)
            newStart = Math.min(newStart, newEnd - SNAP_MINUTES)
          } else if (dragState.type === "resize-end") {
            newEnd = Math.min(
              TOTAL_TIMELINE_MINUTES,
              dragState.originalEndMinutes + deltaMinutes,
            )
            newEnd = Math.max(newEnd, newStart + SNAP_MINUTES)
          }

          return { ...show, startMinutes: newStart, endMinutes: newEnd }
        }),
      )
    }

    const handleMouseUp = () => {
      // Validate overlap after drag
      setPendingShows((prev) => {
        const draggedShow = prev.find((s) => s.id === dragState.showId)
        if (draggedShow) {
          const hasOverlap = checkOverlap(
            draggedShow.startMinutes,
            draggedShow.endMinutes,
            draggedShow.id,
          )
          if (hasOverlap) {
            // Revert to original position
            toast.error("Cannot overlap with existing shows")
            return prev.map((s) =>
              s.id === dragState.showId
                ? {
                    ...s,
                    startMinutes: dragState.originalStartMinutes,
                    endMinutes: dragState.originalEndMinutes,
                  }
                : s,
            )
          }
        }
        return prev
      })
      setDragState(null)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState])

  // Save all pending shows
  const handleSaveAll = async () => {
    if (pendingShows.length === 0) return
    setSaving(true)

    let successCount = 0
    let failCount = 0

    for (const show of pendingShows) {
      const startDate = new Date(selectedDate)
      startDate.setHours(
        TIMELINE_START_HOUR + Math.floor(show.startMinutes / 60),
        show.startMinutes % 60,
      )
      const endDate = new Date(selectedDate)
      endDate.setHours(
        TIMELINE_START_HOUR + Math.floor(show.endMinutes / 60),
        show.endMinutes % 60,
      )

      const result = await createShow({
        movieId: show.movieId,
        date: selectedDate,
        startTime: startDate,
        endTime: endDate,
      })

      if (result.success) {
        successCount++
      } else {
        failCount++
        toast.error(`Failed to create show for "${show.movieTitle}": ${result.message}`)
      }
    }

    if (successCount > 0) {
      toast.success(`Created ${successCount} show${successCount > 1 ? "s" : ""} successfully`)
      setPendingShows([])
      fetchShows(selectedDate)
    }
    if (failCount > 0 && successCount > 0) {
      toast.error(`${failCount} show${failCount > 1 ? "s" : ""} failed to create`)
    }

    setSaving(false)
  }

  const selectedMovie = movies.find((m) => m.id === selectedMovieId)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Showtime Timeline</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[200px]">
              <DatePicker value={selectedDate} onChange={handleDateChange} />
            </div>
            <div className="w-[200px]">
              <Select value={selectedMovieId} onValueChange={setSelectedMovieId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select movie to place" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      <span>{movie.title}</span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({movie.durationInMins}m)
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {pendingShows.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{pendingShows.length} pending</Badge>
                <Button size="sm" onClick={handleSaveAll} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPendingShows([])}
                  disabled={saving}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
        {selectedMovieId && (
          <p className="mt-2 text-sm text-muted-foreground">
            <Film className="mr-1 inline h-3.5 w-3.5" />
            Click on the timeline below to place{" "}
            <span className="font-medium text-foreground">&quot;{selectedMovie?.title}&quot;</span>
            {selectedMovie && (
              <span className="ml-1">({selectedMovie.durationInMins} mins)</span>
            )}
          </p>
        )}
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Hour labels */}
          <div className="relative mb-1 ml-4 flex h-6 items-end">
            {hourMarkers.map((hour) => {
              const minutes = (hour - TIMELINE_START_HOUR) * 60
              const left = minutesToPercent(minutes)
              const h12 = hour % 12 || 12
              const ampm = hour < 12 ? "AM" : "PM"
              return (
                <span
                  key={hour}
                  className="absolute -translate-x-1/2 text-[11px] text-muted-foreground"
                  style={{ left: `${left}%` }}
                >
                  {h12} {ampm}
                </span>
              )
            })}
          </div>

          {/* Timeline track */}
          <TooltipProvider delayDuration={100}>
            <div
              ref={timelineRef}
              className={`relative ml-4 h-20 rounded-lg border-2 border-dashed ${
                selectedMovieId
                  ? "cursor-crosshair border-primary/30 bg-muted/60 hover:border-primary/50"
                  : "border-muted bg-muted/30"
              } transition-colors`}
              onClick={handleTimelineClick}
            >
              {/* Vertical grid lines */}
              {hourMarkers.map((hour) => {
                const minutes = (hour - TIMELINE_START_HOUR) * 60
                const left = minutesToPercent(minutes)
                return (
                  <div
                    key={hour}
                    className="pointer-events-none absolute top-0 h-full border-l border-dashed border-muted-foreground/15"
                    style={{ left: `${left}%` }}
                  />
                )
              })}

              {/* Current time indicator */}
              {(() => {
                const now = new Date()
                const nowMins =
                  (now.getHours() - TIMELINE_START_HOUR) * 60 + now.getMinutes()
                if (
                  nowMins >= 0 &&
                  nowMins <= TOTAL_TIMELINE_MINUTES &&
                  selectedDate.toDateString() === new Date().toDateString()
                ) {
                  return (
                    <div
                      className="pointer-events-none absolute top-0 z-20 h-full w-px bg-red-500"
                      style={{ left: `${minutesToPercent(nowMins)}%` }}
                    >
                      <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-red-500" />
                    </div>
                  )
                }
                return null
              })()}

              {/* Existing shows */}
              {existingShows.map((show) => {
                const { startMins, endMins } = showToTimelineMinutes(
                  show.startTime,
                  show.endTime,
                )
                if (endMins < 0 || startMins > TOTAL_TIMELINE_MINUTES) return null
                const left = minutesToPercent(Math.max(0, startMins))
                const width = minutesToPercent(
                  Math.min(endMins, TOTAL_TIMELINE_MINUTES) - Math.max(0, startMins),
                )
                const colorIdx = movieColorMap.get(show.movie.title) ?? 0
                const color = COLORS[colorIdx]

                return (
                  <Tooltip key={show.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute top-2 bottom-2 rounded-md border ${color.bg} ${color.border} flex items-center justify-center overflow-hidden px-2`}
                        style={{
                          left: `${left}%`,
                          width: `${Math.max(width, 1)}%`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col items-center overflow-hidden">
                          <span
                            className={`truncate text-xs font-medium ${color.text}`}
                          >
                            {show.movie.title}
                          </span>
                          <span className="truncate text-[10px] text-muted-foreground">
                            {format(new Date(show.startTime), "h:mm a")} –{" "}
                            {format(new Date(show.endTime), "h:mm a")}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">{show.movie.title}</p>
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

              {/* Pending shows (draggable) */}
              {pendingShows.map((show) => {
                const left = minutesToPercent(show.startMinutes)
                const width = minutesToPercent(show.endMinutes - show.startMinutes)
                const colorIdx = movieColorMap.get(show.movieTitle) ?? 0
                const color = COLORS[colorIdx]
                const isDragging = dragState?.showId === show.id

                return (
                  <Tooltip key={show.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute top-2 bottom-2 rounded-md border-2 border-dashed ${color.bg} ${color.border} flex items-center justify-center overflow-hidden ${
                          isDragging ? "z-30 opacity-80 shadow-lg" : "z-10"
                        } group`}
                        style={{
                          left: `${left}%`,
                          width: `${Math.max(width, 2)}%`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Left resize handle */}
                        <div
                          className="absolute left-0 top-0 z-10 h-full w-2 cursor-col-resize opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-60"
                          onMouseDown={(e) => handleMouseDown(e, "resize-start", show)}
                        >
                          <div className="flex h-full items-center justify-center">
                            <GripHorizontal className={`h-3 w-3 rotate-90 ${color.text}`} />
                          </div>
                        </div>

                        {/* Move area */}
                        <div
                          className="flex flex-1 cursor-grab flex-col items-center overflow-hidden active:cursor-grabbing"
                          onMouseDown={(e) => handleMouseDown(e, "move", show)}
                        >
                          <span
                            className={`truncate text-xs font-semibold ${color.text}`}
                          >
                            {show.movieTitle}
                          </span>
                          <span className="truncate text-[10px] text-muted-foreground">
                            {timelineMinutesToTimeStr(show.startMinutes)} –{" "}
                            {timelineMinutesToTimeStr(show.endMinutes)}
                          </span>
                        </div>

                        {/* Right resize handle */}
                        <div
                          className="absolute right-0 top-0 z-10 h-full w-2 cursor-col-resize opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-60"
                          onMouseDown={(e) => handleMouseDown(e, "resize-end", show)}
                        >
                          <div className="flex h-full items-center justify-center">
                            <GripHorizontal className={`h-3 w-3 rotate-90 ${color.text}`} />
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          className="absolute -right-1 -top-1 z-20 hidden rounded-full bg-destructive p-0.5 text-destructive-foreground shadow-sm group-hover:block"
                          onClick={(e) => {
                            e.stopPropagation()
                            removePendingShow(show.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">{show.movieTitle} (pending)</p>
                        <p>
                          {timelineMinutesToTimeStr(show.startMinutes)} –{" "}
                          {timelineMinutesToTimeStr(show.endMinutes)}
                        </p>
                        <p className="text-muted-foreground">
                          Duration: {show.endMinutes - show.startMinutes} mins
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Drag to move • Drag edges to resize
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}

              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-background/60">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Empty state hint */}
              {existingShows.length === 0 && pendingShows.length === 0 && !loading && (
                <div className="pointer-events-none flex h-full items-center justify-center text-sm text-muted-foreground">
                  {selectedMovieId
                    ? "Click anywhere to place a show"
                    : "Select a movie above, then click on the timeline to place shows"}
                </div>
              )}
            </div>
          </TooltipProvider>

          {/* Legend */}
          {(existingShows.length > 0 || pendingShows.length > 0) && (
            <div className="ml-4 mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-6 rounded border border-blue-500/40 bg-blue-500/20" />
                Existing shows
              </span>
              {pendingShows.length > 0 && (
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-6 rounded border-2 border-dashed border-blue-500/40 bg-blue-500/20" />
                  Pending shows (unsaved)
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ShowTimeline

