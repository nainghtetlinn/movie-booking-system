import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import db from "prisma/db"
import { comparePassword } from "@/lib/password"
import logger from "@/lib/logger"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "johndoe",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials.password) throw Error("Invalid inputs.")

          const user = await db.user.findUnique({ where: { username: credentials.username } })

          if (user == null) throw Error("User not found.")

          const match = await comparePassword(credentials.password, user.password)

          if (match) return user
          else throw Error("Invalid credentials.")
        } catch (error: any) {
          logger.error("Error: ", error.message)
          return null
        }
      },
    }),
  ],
}
