import { fetchTodayActiveShows } from "@/server-actions/todayShows"
import ShowTimetable from "./ShowTimetable"
import { CalendarClock } from "lucide-react"
import { format } from "date-fns"

const TodayActiveShows = async () => {
  const shows = await fetchTodayActiveShows()

  return (
    <section className="p-4 pt-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Today&apos;s Active Shows</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")} · {shows.length} show{shows.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ShowTimetable shows={shows} />
    </section>
  )
}

export default TodayActiveShows

