import { z } from "zod"

export const showSchema = z
  .object({
    date: z.coerce.date(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
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
    if (val.startTime.getTime() > val.endTime.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time should not be less than Start time.",
        path: ["endTime"],
      })
    }
  })
