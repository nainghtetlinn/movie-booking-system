import HeroImage from "public/hero-image.jpg"

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
import Image from "next/image"

import { useBooking, useBookingFormContext } from "./booking-hooks"

const SelectMovie = () => {
  const { control } = useBookingFormContext()
  const { goNext } = useBooking()

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Choose a movie you want to watch.</CardDescription>
        </CardHeader>
        <CardContent>
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
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-20 w-14 overflow-hidden rounded-md" data-image>
                          <Image
                            src={HeroImage}
                            alt="Harry potter poster"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <span className="font-semibold">Harry Potter</span>
                          <p className="text-xs" data-description>
                            1 HR 50 MIN
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-20 w-14 overflow-hidden rounded-md" data-image>
                          <Image
                            src={HeroImage}
                            alt="Harry potter poster"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <span className="font-semibold">Star War</span>
                          <p className="text-xs" data-description>
                            1 HR 50 MIN
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={goNext}>Next</Button>
        </CardFooter>
      </Card>
    </>
  )
}

export default SelectMovie
