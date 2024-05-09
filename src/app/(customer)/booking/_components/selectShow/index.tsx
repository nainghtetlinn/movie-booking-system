"use client"

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

import { formatShowTime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getShows } from "../../actions"
import { useBookingFormContext } from "../booking-hooks"

const SelectShow = () => {
  const { control, getValues } = useBookingFormContext()

  const selectedMovieId = getValues("movieId")

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["movie", selectedMovieId, "shows"],
    queryFn: () => getShows(selectedMovieId),
  })

  if (isLoading) return <Skeleton className="h-8" />

  if (isError) return <div>Something went wrong.</div>

  if (isSuccess)
    return (
      <FormField
        control={control}
        name="showId"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger ref={field.ref}>
                  <SelectValue placeholder="Select a show" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.map((show) => (
                  <SelectItem key={show.id} value={show.id}>
                    {formatShowTime(show.date, show.startTime, show.endTime)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    )
}

export default SelectShow
