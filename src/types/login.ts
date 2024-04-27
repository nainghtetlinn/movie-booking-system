import { z } from "zod"
import { loginSchema } from "@/validators/login"

export type TLogin = z.infer<typeof loginSchema>
