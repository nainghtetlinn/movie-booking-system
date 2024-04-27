import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(5),
  password: z.string().min(5),
})
