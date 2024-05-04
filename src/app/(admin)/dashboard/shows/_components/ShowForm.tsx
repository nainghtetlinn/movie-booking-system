"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import { TShow } from "@/types/show"
import { format } from "date-fns"
import { UseFormReturn } from "react-hook-form"

const ShowForm = ({
  form,
  movies,
}: {
  form: UseFormReturn<TShow>
  movies: Prisma.MovieGetPayload<{ select: { id: true; title: true } }>[]
}) => {
  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="movieId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a movie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  defaultValue={field.value ? format(field.value, "HH:mm") : "00:00"}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value.split(":")
                      const current = new Date()
                      field.onChange(
                        new Date(
                          current.getFullYear(),
                          current.getMonth(),
                          current.getDate(),
                          +hours,
                          +minutes,
                        ),
                      )
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  defaultValue={field.value ? format(field.value, "HH:mm") : "00:00"}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value.split(":")
                      const current = new Date()
                      field.onChange(
                        new Date(
                          current.getFullYear(),
                          current.getMonth(),
                          current.getDate(),
                          +hours,
                          +minutes,
                        ),
                      )
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </>
  )
}

export default ShowForm
