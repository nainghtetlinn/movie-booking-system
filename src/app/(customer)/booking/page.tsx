"use client"

import TitleTypography from "@/components/TitleTypography"
import { Stepper, Step, StepLabel, StepContent } from "@/components/ui/stepper"
import { Form } from "@/components/ui/form"
import SelectMovie from "./_components/SelectMovie"
import SelectShowtime from "./_components/SelectShowtime"
import SelectSeat from "./_components/SelectSeat"
import Checkout from "./_components/Checkout"

import { useState } from "react"

import BookingContext from "./_components/booking-context"
import { useBookingForm } from "./_components/booking-hooks"
import { TBookingClient } from "@/types/booking"

export const steps: {
  component: JSX.Element
  label: string
  field?: "movieId" | "showtimeId" | "seatIds"
}[] = [
  {
    component: <SelectMovie />,
    label: "Select movie",
    field: "movieId",
  },
  {
    component: <SelectShowtime />,
    label: "Select showtime",
    field: "showtimeId",
  },
  {
    component: <SelectSeat />,
    label: "Select seat",
    field: "seatIds",
  },
  {
    component: <Checkout />,
    label: "Checkout",
  },
]

const BookingPage = () => {
  const form = useBookingForm()

  const onSubmit = (e: TBookingClient) => {
    console.log(e)
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
    <>
      <BookingContext.Provider value={{ goNext, goPrev }}>
        <section className="container">
          <TitleTypography>Booking</TitleTypography>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                className="mb-12 max-w-[700px]">
                {steps.map((step, i) => (
                  <Step key={i}>
                    <StepLabel
                      onClick={() => setActiveStep(i)}
                      className="cursor-pointer transition-colors hover:text-primary">
                      {step.label}
                    </StepLabel>
                    <StepContent>{step.component}</StepContent>
                  </Step>
                ))}
              </Stepper>
            </form>
          </Form>
        </section>
      </BookingContext.Provider>
    </>
  )
}

export default BookingPage
