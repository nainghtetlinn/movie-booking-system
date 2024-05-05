import { z } from "zod"

export const staffSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters long."),
  password: z.string().min(5, "Password must be at least 5 characters long."),
  role: z.enum(["admin", "staff", "test_staff"]).optional(),
})
