import { Input } from "./ui/input"

import { format } from "date-fns"

interface Props {
  value: Date
  onChange: (value: Date) => void
}

const TimeInput = ({ value, onChange }: Props) => {
  return (
    <Input
      type="time"
      defaultValue={value ? format(value, "HH:mm") : "00:00"}
      onChange={(e) => {
        if (e.target.value) {
          const [hours, minutes] = e.target.value.split(":")
          const current = new Date()
          onChange(
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
  )
}

export default TimeInput
