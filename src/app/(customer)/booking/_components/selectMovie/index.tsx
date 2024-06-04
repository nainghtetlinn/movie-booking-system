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

import Image from "next/image"
import { formatTime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getMovies } from "@/server-actions/booking"
import { useBookingFormContext } from "../booking-hooks"

const SelectMovie = () => {
  const { control } = useBookingFormContext()

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies(),
  })

  if (isLoading) return <Skeleton className="h-8" />

  if (isError) return <div>Something went wrong.</div>

  if (isSuccess)
    return (
      <FormField
        control={control}
        name="movieId"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger
                  ref={field.ref}
                  className="[&_[data-description]]:hidden [&_[data-image]]:hidden">
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.map((movie) => (
                  <SelectItem key={movie.id} value={movie.id}>
                    <div className="flex items-center space-x-4">
                      <div
                        className="relative aspect-[2/3] w-14 overflow-hidden rounded-md"
                        data-image>
                        <Image
                          src={movie.posterUrl}
                          alt={`Poster of ${movie.title}`}
                          className="h-full w-full object-cover"
                          width={56}
                          height={84}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{movie.title}</p>
                        <p className="mt-2 text-xs" data-description>
                          {formatTime(movie.durationInMins)}
                        </p>
                      </div>
                    </div>
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

export default SelectMovie
