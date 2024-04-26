import { Card, CardContent, CardHeader, CardFooter, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { useBooking, useBookingFormContext } from "./booking-hooks"

const SelectShowtime = () => {
  const { control } = useBookingFormContext()
  const { goNext, goPrev } = useBooking()

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Choose a showtime when you want to watch.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="showtimeId"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">10 AM - 12 PM</SelectItem>
                    <SelectItem value="2">1 PM - 3 PM</SelectItem>
                  </SelectContent>
                </Select>
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

export default SelectShowtime
