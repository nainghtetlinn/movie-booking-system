"use server"

import { checkPermission } from "@/configs/auth"
import { TMovie } from "@/types/movie"
import { movieSchema } from "@/validators/movie"
import { Movie } from "@prisma/client"
import { revalidatePath } from "next/cache"
import db from "@/configs/db"

type TReturn = { success: true; data: Movie } | { success: false; message: string }

export async function createMovie(data: TMovie): Promise<TReturn> {
  const isAllow = await checkPermission()
  if (!isAllow) return { success: false, message: "Permission denied." }

  try {
    const validation = movieSchema.safeParse(data)
    if (!validation.success) return { success: false, message: "Invalid inputs." }
    const movie = await db.movie.create({ data })
    revalidatePath("/dashboard/movies")
    return { success: true, data: movie }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export async function editMovie(id: string, data: TMovie): Promise<TReturn> {
  const isAllow = await checkPermission()
  if (!isAllow) return { success: false, message: "Permission denied." }

  try {
    const validation = movieSchema.safeParse(data)
    if (!validation.success) return { success: false, message: "Invalid inputs." }
    const movie = await db.movie.update({ where: { id }, data })
    revalidatePath("/dashboard/movies")
    return { success: true, data: movie }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export async function deleteMovie(id: string): Promise<TReturn> {
  const isAllow = await checkPermission()
  if (!isAllow) return { success: false, message: "Permission denied." }

  try {
    const movie = await db.movie.delete({ where: { id } })
    revalidatePath("/dashboard/movies")
    return { success: true, data: movie }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}

export const fetchDashboardMovies = async (filter: "all" | "showing" | "upcoming") => {
  let where = {}
  let start = new Date(2024, 5, 2)
  let end = new Date(2024, 5, 3)

  if (filter === "showing")
    where = {
      releaseDate: { gte: start.toISOString(), lte: end.toISOString() },
    }
  else if (filter === "upcoming")
    where = {
      releaseDate: { gte: end.toISOString() },
    }

  return await db.movie.findMany({
    include: {
      _count: true,
    },
    where,
    orderBy: { createdAt: "desc" },
  })
}
