'use server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { RegisterSchema, RegisterSchemaType } from '@/lib/zod-schema'

export async function RegisterAccountAction(form: RegisterSchemaType) {
    const parsedBody = RegisterSchema.safeParse(form)

    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message)
    }

    const { email, password } = parsedBody.data
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const existingEmail = await db.user.findUnique({
            where: { email }
        })

        if (existingEmail) {
            throw new Error("Email already existing")
        }

        await db.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        return { succes: true }
    } catch (error) {
        console.log("Error during registration", error)
        throw new Error("Registration failed")
    }
}