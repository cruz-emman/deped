'use server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { AccountSchema, AccountSchemaType } from '@/lib/zod-schema'

export async function UpdateAccount(form: AccountSchemaType) {

  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    console.log("User not authenticated")
    return { error: "You are not authorized" }
  }

  if (!session.user.email) {
    console.log("User email not found")
    return { error: "Email not found" }
  }

  const parsedBody = AccountSchema.safeParse(form)

  if (!parsedBody.success) {
    console.error("Validation error:", parsedBody.error)
    return { error: "Invalid form data" }
  }

  const {
    first_name,
    middle_name,
    last_name,
    sex,
    position,
    position_other,
    classification,
    section_or_unit,
    division_office,
    years_in_service,
    undergraduate_course,
    date_graduated,
    doctorate_degree,
    master_degree,
    school
  } = parsedBody.data

  try {
    const newAccount = await db.account.create({
      data: {
        first_name,
        middle_name,
        last_name,
        sex,
        position,
        position_other,
        classification,
        section_or_unit,
        undergraduate_course,
        division_office,
        years_in_service,
        date_graduated,
        master_degree,
        doctorate_degree,
        school,
        email: session.user.email,
        accountId: session.user.id,
      }
    })

    return { success: "Account updated successfully", newAccount }

  } catch (error) {
    console.error("Error creating account:", error)
    return { error: "Failed to create account. Please try again." }
  }
}

