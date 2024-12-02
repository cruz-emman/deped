// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      affiliation?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    password?: string
    emailVerified?: Date | null
    image?: string | null
    role: string
    affiliation?: string | null
    createdAt?: Date
    updateAt?: Date
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    affiliation?: string
  }
}