"use server"

import { TStaff } from "@/types/staff"
import { staffSchema } from "@/validators/staff"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import db, { exclude } from "prisma/db"
import { hashPassword } from "@/lib/password"

type TReturn =
  | {
      success: true
      data: Prisma.UserGetPayload<{
        select: {
          id: true
          username: true
          role: true
        }
      }>
    }
  | { success: false; message: string }

export async function createStaff(data: TStaff): Promise<TReturn> {
  try {
    const validation = staffSchema.safeParse(data)
    if (!validation.success) return { success: false, message: "Invalid inputs." }

    const hashedPassword = await hashPassword(data.password)
    data.password = hashedPassword

    const staff = await db.user.create({ data })
    revalidatePath("/dashboard/staffs")
    return { success: true, data: exclude(staff, "password") }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export async function deleteStaff(id: string): Promise<TReturn> {
  try {
    const staff = await db.user.delete({ where: { id } })
    revalidatePath("/dashboard/staffs")
    return { success: true, data: exclude(staff, "password") }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}
