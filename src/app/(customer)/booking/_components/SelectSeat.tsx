import { Card, CardContent, CardHeader, CardFooter, CardDescription } from "@/components/ui/card"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useBooking, useBookingFormContext } from "./booking-hooks"
import React from "react"

const seats = [
  {
    price: 2000,
    class: "normal",
    rows: [
      {
        row: "A",
        seats: [
          { id: "a1", number: 1 },
          { id: "a2", number: 2 },
          { id: "a3", number: 3 },
          { id: "a4", number: 4 },
          { id: "a5", number: 5 },
          { id: "a6", number: 6 },
          { id: "a7", number: 7 },
          { id: "a8", number: 8 },
          { id: "a9", number: 9 },
          { id: "a10", number: 10 },
        ],
      },
      {
        row: "B",
        seats: [
          { id: "b1", number: 1 },
          { id: "b2", number: 2 },
          { id: "b3", number: 3 },
          { id: "b4", number: 4 },
          { id: "b5", number: 5 },
          { id: "b6", number: 6 },
          { id: "b7", number: 7 },
          { id: "b8", number: 8 },
          { id: "b9", number: 9 },
          { id: "b10", number: 10 },
        ],
      },
    ],
  },
  {
    price: 3000,
    class: "vip",
    rows: [
      {
        row: "C",
        seats: [
          { id: "c1", number: 1 },
          { id: "c2", number: 2 },
          { id: "c3", number: 3 },
          { id: "c4", number: 4 },
          { id: "c5", number: 5 },
          { id: "c6", number: 6 },
          { id: "c7", number: 7 },
          { id: "c8", number: 8 },
          { id: "c9", number: 9 },
          { id: "c10", number: 10 },
        ],
      },
      {
        row: "D",
        seats: [
          { id: "d1", number: 1 },
          { id: "d2", number: 2 },
          { id: "d3", number: 3 },
          { id: "d4", number: 4 },
          { id: "d5", number: 5 },
          { id: "d6", number: 6 },
          { id: "d7", number: 7 },
          { id: "d8", number: 8 },
          { id: "d9", number: 9 },
          { id: "d10", number: 10 },
        ],
      },
    ],
  },
]

const SelectSeat = () => {
  const { control } = useBookingFormContext()
  const { goNext, goPrev } = useBooking()

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Choose avaliable seat(s).</CardDescription>
        </CardHeader>
        <CardContent>
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
                    className="flex-wrap">
                    {seats.map((c) => {
                      return (
                        <React.Fragment key={c.class}>
                          <div className="flex w-full flex-wrap items-center justify-between gap-4">
                            <div>
                              <h5>Class: {c.class}</h5>
                              <h5>Price: {c.price}</h5>
                            </div>
                            <div className="shrink-0">
                              {c.rows.map((row) => {
                                return (
                                  <div>
                                    {row.seats.map((seat) => (
                                      <ToggleGroupItem
                                        key={seat.id}
                                        value={seat.id}
                                        className="h-8 w-8 bg-green-500 text-sm">
                                        {row.row}
                                        {seat.number}
                                      </ToggleGroupItem>
                                    ))}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <Separator />
                        </React.Fragment>
                      )
                    })}
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={goPrev}>
            Prev
          </Button>
          <Button onClick={goNext}>Next</Button>
        </CardFooter>
      </Card>
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
