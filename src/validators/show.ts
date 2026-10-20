import { z } from "zod"

export const showSchema = z
  .object({
    date: z.date({
      error: (issue) => {
        if (issue.input === undefined) {
          return "Show date is required."
        }
        return "Invalid date."
      },
    }),
    startTime: z.date({
      error: (issue) => {
        if (issue.input === undefined) {
          return "Start time is required."
        }
        return "Invalid time."
      },
    }),
    endTime: z.date({
      error: (issue) => {
        if (issue.input === undefined) {
          return "End time is required."
        }
        return "Invalid time."
      },
    }),
    movieId: z.string().min(1, "Movie id required."),
  })
  .transform((val) => {
    val.startTime = new Date(
      val.date.getFullYear(),
      val.date.getMonth(),
      val.date.getDate(),
      val.startTime.getHours(),
      val.startTime.getMinutes(),
    )
    val.endTime = new Date(
      val.date.getFullYear(),
      val.date.getMonth(),
      val.date.getDate(),
      val.endTime.getHours(),
      val.endTime.getMinutes(),
    )
    return val
  })
  .superRefine((val, ctx) => {
    if (val.endTime.getTime() <= val.startTime.getTime()) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be greater than Start time.",
        path: ["endTime"],
      })
    }
  })
