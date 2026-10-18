import { PrismaClient, User } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  })
  return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const db = globalForPrisma.prisma ?? prismaClientSingleton()

export const exclude = (user: User, ...keys: (keyof User)[]) => {
  for (let key of keys) {
    delete user[key]
  }
  return user
}

export default db

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
