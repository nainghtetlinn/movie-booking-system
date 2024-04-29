import { faker } from "@faker-js/faker"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

const main = async () => {
  const hashedPassword = await bcrypt.hash("11111", 10)
  await db.user.create({
    data: {
      username: "naing",
      role: "admin",
      password: hashedPassword,
    },
  })
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
