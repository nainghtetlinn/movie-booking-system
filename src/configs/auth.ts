import NextAuth, { type DefaultSession } from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"

import { Role } from "@/generated/prisma/client"
import logger from "@/lib/logger"
import { comparePassword, hashPassword } from "@/lib/password"
import db, { exclude } from "@/configs/db"

declare module "next-auth" {
  interface User {
    id: string
    username: string
    role: Role
  }

  interface Session {
    user: {
      id: string
      username: string
      role: Role
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    role: Role
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
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
          const username = credentials?.username
          const password = credentials?.password
          if (typeof username !== "string" || typeof password !== "string") {
            throw Error("Invalid inputs.")
          }

          const user = await db.user.findUnique({ where: { username } })

          if (user == null) {
            if (
              username === process.env.ADMIN_USERNAME &&
              password === process.env.ADMIN_PASSWORD
            ) {
              const hashedPassword = await hashPassword(password)
              return await db.user.create({
                data: { username, password: hashedPassword, role: "admin" },
              })
            } else throw Error("User not found.")
          }

          const match = await comparePassword(password, user.password)

          if (match) return exclude(user, "password")
          else throw Error("Invalid credentials.")
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error"
          logger.error("Error: ", message)
          throw new Error(message)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id && user.username && user.role) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.id && token.username && token.role) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.role = token.role
      }
      return session
    },
  },
})

export const checkPermission = async () => {
  const session = await auth()
  if (session?.user.role === "admin" || session?.user.role === "staff") return true
  return false
}
