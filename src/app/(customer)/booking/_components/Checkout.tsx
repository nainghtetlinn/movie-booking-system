import { Card, CardContent, CardHeader, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useBooking, useBookingFormContext } from "./booking-hooks"

const Checkout = () => {
  const { getValues } = useBookingFormContext()
  const { goPrev } = useBooking()

  const { movieId, showtimeId, seatIds } = getValues()

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>
            Before confirm your checkout, please review your movie, showtime and seat(s).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h5>Movie: Harry Potter</h5>
          <h5>Showtime: 10 AM - 12 PM</h5>
          <h5>
            Seat(s):{" "}
            {seatIds.map((id) => (
              <span key={id} className="mr-1 uppercase">
                {id}
              </span>
            ))}
          </h5>
          <h5>Total amount: 6000 Ks</h5>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={goPrev}>
            Prev
          </Button>
          <Button type="submit">Confirm</Button>
        </CardFooter>
      </Card>
    </>
  )
}

export default Checkout
