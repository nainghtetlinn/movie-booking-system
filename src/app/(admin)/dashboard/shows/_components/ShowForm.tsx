"use client"

import DatePicker from "@/components/DatePicker"
import TimeInput from "@/components/TimeInput"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TShowMovieOptions } from "@/types/show"
import { addMinutes } from "date-fns"
import { useEffect } from "react"
import { Controller, FormProvider, UseFormReturn } from "react-hook-form"
import { ShowFormInput, ShowFormOutput } from "./show-hooks"

type ShowFormProps = {
  form: UseFormReturn<ShowFormInput, unknown, ShowFormOutput>
  movies: TShowMovieOptions
}

const ShowForm = ({ form, movies }: ShowFormProps) => {
  const { control, getValues } = form

  const updateEndTime = () => {
    const selectedMovieId = getValues("movieId")
    const startTime = getValues("startTime")

    if (!selectedMovieId || !startTime) return

    const movie = movies.find((m) => m.id === selectedMovieId)

    if (!movie || movie.durationInMins === 0) return

    const startDate = new Date(startTime)

    if (!isNaN(startDate.getTime())) {
      // Add the movie's duration in minutes to the start time
      const calculatedEndTime = addMinutes(startDate, movie.durationInMins)

      // Update the endTime field in the form
      form.setValue("endTime", calculatedEndTime, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    }
  }

  return (
    <>
      <FormProvider {...form}>
        <Controller
          control={control}
          name="movieId"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Movie</FieldLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val)
                  updateEndTime()
                }}
                defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Date</FieldLabel>
              <DatePicker value={field.value} onChange={field.onChange} />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="startTime"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Start Time</FieldLabel>
              <TimeInput
                value={field.value}
                onChange={(val) => {
                  field.onChange(val)
                  updateEndTime()
                }}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="endTime"
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>End Time</FieldLabel>
                <TimeInput value={field.value} onChange={field.onChange} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )
          }}
        />
      </FormProvider>
    </>
  )
}

export default ShowForm
