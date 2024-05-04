"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"

interface Props {
  value: Date
  onChange: (value: Date | undefined) => void
}

const DatePicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full pl-3 text-left font-normal", !value && "text-muted-foreground")}>
          {value ? format(value, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(e) => {
            onChange(e)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
