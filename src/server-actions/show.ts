"use server"

import { TShow } from "@/types/show"
import { showSchema } from "@/validators/show"
import { Show } from "@prisma/client"
import { revalidatePath } from "next/cache"
import db from "prisma/db"

type TReturn = { success: true; data: Show } | { success: false; message: string }

export async function createShow(data: TShow): Promise<TReturn> {
  try {
    const validation = showSchema.safeParse(data)
    if (!validation.success) return { success: false, message: "Invalid inputs." }
    const show = await db.show.create({ data })
    revalidatePath("/dashboard/shows")
    return { success: true, data: show }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export async function editShow(id: string, data: TShow): Promise<TReturn> {
  try {
    const validation = showSchema.safeParse(data)
    if (!validation.success) return { success: false, message: "Invalid inputs." }
    const show = await db.show.update({ where: { id }, data })
    revalidatePath("/dashboard/shows")
    return { success: true, data: show }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export async function deleteShow(id: string): Promise<TReturn> {
  try {
    const show = await db.show.delete({ where: { id } })
    revalidatePath("/dashboard/shows")
    return { success: true, data: show }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}
