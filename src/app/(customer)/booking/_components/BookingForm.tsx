"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Step, StepContent, StepLabel, Stepper } from "@/components/ui/stepper"
import { Loader2 } from "lucide-react"
import Checkout from "./checkout"
import SelectMovie from "./selectMovie"
import SelectSeat from "./selectSeat"
import SelectShow from "./selectShow"

import { TBookingClient } from "@/types/booking"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { makeBooking } from "@/server-actions/booking"
import { useBookingForm } from "./booking-hooks"
import { redirect } from "next/navigation"

const BookingForm = () => {
  const searchParams = useSearchParams()
  const movieId = searchParams.get("movieId")
  const showId = searchParams.get("showId")

  const form = useBookingForm({ movieId: movieId || "", showId: showId || "", email: "" })

  const [loading, setLoading] = useState(false)
  const onSubmit = async (data: TBookingClient) => {
    setLoading(true)
    try {
      await makeBooking(data)
      toast.success("Booking success.")
    } catch (error) {
      toast.error("Something went worng.")
    } finally {
      setLoading(false)
      form.reset()
      setActiveStep(0)
    }
  }

  const [activeStep, setActiveStep] = useState(0)

  const goNext = async () => {
    const field = steps[activeStep].field
    const output = await form.trigger(field, { shouldFocus: true })
    if (!output) return

    if (activeStep + 1 === steps.length) return console.log("Finished.")
    setActiveStep(activeStep + 1)
  }

  const goPrev = () => {
    if (activeStep === 0) return console.log("Start.")
    setActiveStep(activeStep - 1)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stepper activeStep={activeStep} orientation="vertical" className="mb-12 max-w-[700px]">
          {steps.map((step, i) => (
            <Step key={i}>
              <StepLabel>{step.title}</StepLabel>
              <StepContent>
                <Card>
                  <CardHeader>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>{step.component}</CardContent>
                  <CardFooter className="flex justify-end space-x-4">
                    {i !== 0 && (
                      <Button variant="outline" onClick={goPrev}>
                        Prev
                      </Button>
                    )}
                    {i !== steps.length - 1 ? (
                      <Button onClick={goNext}>Next</Button>
                    ) : (
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirm
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </form>
    </Form>
  )
}

export const steps: {
  component: JSX.Element
  title: string
  description: string
  field?: "movieId" | "showId" | "seatIds"
}[] = [
  {
    component: <SelectMovie />,
    title: "Select movie",
    description: "Choose a movie you want to watch.",
    field: "movieId",
  },
  {
    component: <SelectShow />,
    title: "Select showtime",
    description: "Choose a showtime when you want to watch.",
    field: "showId",
  },
  {
    component: <SelectSeat />,
    title: "Select seat",
    description: "Choose avaliable seat(s).",
    field: "seatIds",
  },
  {
    component: <Checkout />,
    title: "Checkout",
    description: "Before confirm your checkout, please review your movie, showtime and seat(s).",
  },
]

export default BookingForm
