import { staffSchema } from "@/validators/staff"
import { Prisma } from "@prisma/client"
import { z } from "zod"

export type TStaff = z.infer<typeof staffSchema>

export type TStaffTableItem = Prisma.UserGetPayload<{
  select: {
    id: true
    username: true
    role: true
    _count: {
      select: { bookings: true }
    }
  }
}>
