"use server"

import { TMovie } from "@/types/movie"
import { movieSchema } from "@/validators/movie"
import { Movie } from "@prisma/client"
import { revalidatePath } from "next/cache"
import db from "prisma/db"

type TReturn = { success: true; data: Movie } | { success: false; message: string }

export async function createMovie(data: TMovie): Promise<TReturn> {
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
  try {
    const movie = await db.movie.delete({ where: { id } })
    revalidatePath("/dashboard/movies")
    return { success: true, data: movie }
  } catch (error) {
    return { success: false, message: "Something went wrong." }
  }
}
