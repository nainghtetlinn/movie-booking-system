"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import { useBookingFormContext } from "../booking-hooks"
import { useQuery } from "@tanstack/react-query"
import { getCheckout } from "@/server-actions/booking"
import { format } from "date-fns"

const Checkout = () => {
  const { control, getValues } = useBookingFormContext()

  const { movieId, showId, seatIds } = getValues()

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["checkout", movieId, showId, seatIds],
    queryFn: () => getCheckout({ movieId, showId, seatIds }),
  })

  if (isLoading)
    return (
      <>
        <div className="mb-4 flex gap-2">
          <Skeleton className="aspect-[2/3] w-20" />
          <Skeleton className="flex-1" />
        </div>
        <Skeleton className="h-10" />
      </>
    )

  if (isError) return <div>Something went wrong.</div>

  if (isSuccess && data.movie && data.show && data.seats.length > 0)
    return (
      <>
        <div className="mb-4 flex gap-2">
          <div
            className="relative aspect-[2/3] w-20 shrink-0 self-start overflow-hidden rounded-md md:w-28"
            data-image>
            <img
              src={data.movie.posterUrl}
              alt={`Poster of ${data.movie.title}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="md:text-lg">
            <h5>{`Movie: ${data.movie.title}`}</h5>
            <h5>
              {`Showtime: ${format(data.show.date, "MMM dd")} - ${format(data.show.startTime, "hh:mm a")} - ${format(data.show.endTime, "hh:mm a")}`}
            </h5>
            <h5>
              Seat(s):{" "}
              {data.seats.map((s) => (
                <span key={s.id} className="mr-1 uppercase">
                  {s.row}
                  {s.number}
                </span>
              ))}
            </h5>
            <h5>
              Total amount:{" "}
              {data.seats
                .reduce((t, c) => {
                  return t + c.price
                }, 0)
                .toLocaleString()}{" "}
              Ks
            </h5>
          </div>
        </div>

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormDescription>The booking details will be sent to this email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    )
}

export default Checkout
