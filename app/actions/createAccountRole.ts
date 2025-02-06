'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { CreateRoleAccountSchema, CreateRoleAccountSchemaType } from '@/lib/zod-schema'



export async function CreateAccountActionRole(form: CreateRoleAccountSchemaType) {

  const session = await auth()

  if (!session) {
    console.log("User not authenticated")
    return { error: "You are not authorized" }
  }

  const parsedBody = CreateRoleAccountSchema.safeParse(form)

  if (!parsedBody.success) {
    console.error("Validation error details:", parsedBody.error.flatten())
    return { 
      error: "Invalid form data", 
      details: parsedBody.error.flatten().fieldErrors 
    }
  }

  const {password, email, role, affiliation, first_name, middle_name, last_name, school_assigned } = parsedBody.data

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingEmail = await db.user.findUnique({
      where: { email: email }
    })

    if (existingEmail) {
      return { error: "Email already exists." }
    }


    const newUser = await db.user.create({
      data: {
     
        password: hashedPassword,
        email,
        role,
        affiliation,
        school_assigned
      }
    })

    await db.account.create({
      data: {
        email: newUser.email,
        accountId: newUser.id,
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        school: school_assigned
      }
    })

    console.log("Account created successfully:", newUser.id)
    return { success: "Account created successfully" }

  } catch (error) {
    console.error("Error creating account:", JSON.stringify(error, null, 2))
    return { 
      error: "Failed to create account. Please check the logs.", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}