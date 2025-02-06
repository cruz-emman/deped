import type { NextAuthConfig } from "next-auth"
import credentials from "next-auth/providers/credentials"
import { db } from "./lib/db"
import bcrypt from 'bcryptjs'
import { LoginSchema } from "./lib/zod-schema"

export default {
    providers: [
        credentials({
            async authorize(credentials) {
                try {
                    const validatedFields = LoginSchema.safeParse(credentials)

                    if (!validatedFields.success) {
                        return null
                    }

                    const { email, password } = validatedFields.data

                    const existingUser = await db.user.findUnique({
                        where: { email }
                    })

                    if (!existingUser || !existingUser.password) {
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        existingUser.password
                    )

                    if (passwordsMatch) {
                        // Return only the fields that match the User interface
                        return {
                            id: existingUser.id,
                            email: existingUser.email,
                            role: existingUser.role,
                            affiliation: existingUser.affiliation,
                            image: existingUser.image,
                            emailVerified: existingUser.emailVerified
                        }
                    }

                    return null
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            }
        })
    ]
} satisfies NextAuthConfig