import { Role } from "@prisma/client"
import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import logger from "@/lib/logger"
import { comparePassword, hashPassword } from "@/lib/password"
import { getServerSession } from "next-auth"
import db, { exclude } from "prisma/db"

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
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    role: Role
  }
}

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

          if (user == null) {
            if (
              credentials.username === process.env.ADMIN_USERNAME &&
              credentials.password === process.env.ADMIN_PASSWORD
            ) {
              const hashedPassword = await hashPassword(credentials.password)
              return await db.user.create({
                data: { username: credentials.username, password: hashedPassword, role: "admin" },
              })
            } else throw Error("User not found.")
          }

          const match = await comparePassword(credentials.password, user.password)

          if (match) return exclude(user, "password")
          else throw Error("Invalid credentials.")
        } catch (error: any) {
          logger.error("Error: ", error.message)
          throw new Error(error.message)
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
}

export const checkPermission = async () => {
  const session = await getServerSession(authOptions)
  if (session?.user.role === "admin" || session?.user.role === "staff") return true
  return false
}
