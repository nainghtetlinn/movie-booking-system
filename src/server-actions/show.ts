"use server"

import { checkPermission } from "@/configs/auth"
import { TShow } from "@/types/show"
import { showSchema } from "@/validators/show"
import { Prisma, Show } from "@prisma/client"
import { revalidatePath } from "next/cache"
import db from "@/configs/db"

type TReturn = { success: true; data: Show } | { success: false; message: string }

export async function createShow(data: TShow): Promise<TReturn> {
  const isAllow = await checkPermission()
  if (!isAllow) return { success: false, message: "Permission denied." }

  try {
    const validation = showSchema.safeParse(data)
    if (!validation.success) return { success: false, message: "Invalid inputs." }
    // create show
    const show = await db.show.create({ data })

    // create show's seats
    const showSeatRelations: Prisma.ShowSeatRelationCreateManyInput[] = []
    const seats = await db.seat.findMany()
    seats.forEach((seat) => showSeatRelations.push({ seatId: seat.id, showId: show.id }))
    await db.showSeatRelation.createMany({ data: showSeatRelations })

    revalidatePath("/dashboard/shows")
    return { success: true, data: show }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export async function editShow(id: string, data: TShow): Promise<TReturn> {
  const isAllow = await checkPermission()
  if (!isAllow) return { success: false, message: "Permission denied." }

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
  const isAllow = await checkPermission()
  if (!isAllow) return { success: false, message: "Permission denied." }

  try {
    // delete show
    const show = await db.show.delete({ where: { id } })

    // delete show's seats
    await db.showSeatRelation.deleteMany({ where: { showId: show.id } })

    revalidatePath("/dashboard/shows")
    return { success: true, data: show }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export const fetchDashboardShows = async (filter: "all" | "showing" | "upcoming") => {
  let where = {}
  let start = new Date(2024, 5, 2)
  let end = new Date(2024, 5, 3)

  if (filter === "showing")
    where = {
      date: { gte: start.toISOString(), lte: end.toISOString() },
    }
  else if (filter === "upcoming")
    where = {
      date: { gte: end.toISOString() },
    }

  return await db.show.findMany({
    include: {
      movie: { select: { title: true, posterUrl: true } },
      _count: { select: { tickets: true } },
    },
    where,
    orderBy: {
      startTime: "asc",
    },
  })
}
