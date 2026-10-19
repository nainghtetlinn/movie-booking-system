"use client"

import DatePicker from "@/components/DatePicker"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { Controller, FormProvider, UseFormReturn } from "react-hook-form"
import { MovieFormInput, MovieFormOutput } from "./movie-hooks"

type MovieFormProps = {
  form: UseFormReturn<MovieFormInput, unknown, MovieFormOutput>
}

const MovieForm = ({ form }: MovieFormProps) => {
  const { control } = form

  return (
    <FormProvider {...form}>
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="posterUrl"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Poster Url</FieldLabel>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="genre"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Genre</FieldLabel>
            <Input {...field} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="durationInMins"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Duration in minute</FieldLabel>
            <Input
              type="number"
              ref={field.ref}
              value={field.value === 0 ? "" : (field.value as number)}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        control={control}
        name="releaseDate"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Release date</FieldLabel>
            <DatePicker value={field.value as Date} onChange={field.onChange} />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
    </FormProvider>
  )
}

export default MovieForm
