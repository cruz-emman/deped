'use server'
import { db } from '@/lib/db'
import { LoginSchema, LoginSchemaType } from '@/lib/zod-schema'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function LoginAccountAction(form: LoginSchemaType) {
    const parsedBody = LoginSchema.safeParse(form)

    if (!parsedBody.success) {
        return { error: parsedBody.error.message, status: "error" }
    }

    const { email, password } = parsedBody.data

    try {
        const existingEmail = await db.user.findUnique({
            where: { email }
        })

        if (!existingEmail || !existingEmail.email || !existingEmail.password) {
            return { error: "Invalid Credentials", status: "error" }
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        return { success: "Successfully Log in" }



    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials", status: "error" }
                default:
                    return { error: "Something went wrong", status: "error" }
            }
        }

        return { error: "An unexpected error occurred", status: "error" }
    }
}