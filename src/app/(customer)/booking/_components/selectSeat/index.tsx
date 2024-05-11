"use client"

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { useMemo } from "react"
import { getSeats } from "../../actions"
import { useBookingFormContext } from "../booking-hooks"

const SelectSeat = () => {
  const { control, getValues } = useBookingFormContext()

  const selectedMovieId = getValues("movieId")
  const selectedShowId = getValues("showId")

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["movie", selectedMovieId, "show", selectedShowId, "seats"],
    queryFn: () => getSeats(selectedShowId),
  })

  const seats = useMemo(() => {
    const classes: string[] = []
    const rows: string[] = []

    const groupedByRow: Prisma.SeatGetPayload<{ include: { showSeatRelation: true } }>[][] = []
    const groupedByClass: Prisma.SeatGetPayload<{ include: { showSeatRelation: true } }>[][][] = []

    if (isSuccess) {
      data.forEach((d) => {
        if (!classes.includes(d.class)) classes.push(d.class)
        if (!rows.includes(d.row)) rows.push(d.row)
      })

      rows.forEach((r) => {
        groupedByRow.push(data.filter((d) => d.row === r))
      })

      classes.forEach((c) => {
        groupedByClass.push(groupedByRow.filter((r) => r[0].class === c))
      })
    }

    return groupedByClass
  }, [data])

  if (isLoading) return <Skeleton className="h-32" />

  if (isError) return <div>Something went wrong.</div>

  if (isSuccess)
    return (
      <>
        <SeatTypeKeys />
        <FormField
          control={control}
          name="seatIds"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ToggleGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  variant="outline"
                  size="sm"
                  type="multiple"
                  className="block">
                  {seats.map((c, ci) => {
                    return (
                      <div key={ci}>
                        <div className="my-2">{`${c[0][0].class} - ${c[0][0].price} Ks`}</div>
                        {c.map((row, ri) => {
                          return (
                            <div key={ri}>
                              {row.map((seat) => (
                                <ToggleGroupItem
                                  key={seat.id}
                                  value={seat.id}
                                  disabled={seat.showSeatRelation[0].status === "purchased"}
                                  className={clsx(
                                    "h-8 w-8 text-xs md:h-10 md:w-10 md:text-sm",
                                    seat.showSeatRelation[0].status === "purchased"
                                      ? "bg-red-500 !opacity-100"
                                      : "bg-green-500",
                                  )}>
                                  {seat.row}
                                  {seat.number}
                                </ToggleGroupItem>
                              ))}
                            </div>
                          )
                        })}
                        <Separator className="mt-4" />
                      </div>
                    )
                  })}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    )
}

const SeatTypeKeys = () => {
  return (
    <div className="mb-8 flex gap-4">
      <div className="flex items-center gap-2">
        <div className="bg- h-4 w-4 rounded-md bg-green-500"></div>
        <p>Avaliable</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-md bg-red-500"></div>
        <p>Purchased</p>
      </div>
    </div>
  )
}

export default SelectSeat
