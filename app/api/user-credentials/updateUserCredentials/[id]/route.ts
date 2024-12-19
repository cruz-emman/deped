import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { revalidatePath } from "next/cache"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const body = await req.json()
        const {
            name,
            email,
            password,
            role,
            affiliation
        } = body

        const existingUser = await db.user.findUnique({
            where: {
                id: params.id
            }
        })

        if(!existingUser){
            return NextResponse.json({message: "User is not authenticated"}, {status: 404})
        }

        // Check for email uniqueness only if email is being changed
        if (email && email !== existingUser.email) {
            const existingEmail = await db.user.findUnique({
                where: {
                    email: email
                }
            })

            if (existingEmail) {
                return NextResponse.json({message: "Email is already in use"}, {status: 409})
            }
        }

        // Prepare update data
        const updateData: any = {}

        // Only update fields that are provided
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (role) updateData.role = role
        if (affiliation) updateData.affiliation = affiliation

        // Only hash and update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const user = await db.user.update({
            where: {
                id: params.id
            },
            data: updateData
        })
       
        revalidatePath('/')
        return NextResponse.json(user, {status: 200})
    } catch (error) {
        console.error(error) // Use console.error for better error logging
        return NextResponse.json({message: "An error occurred", error}, {status: 500})
    }
}