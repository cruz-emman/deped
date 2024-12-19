import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { revalidatePath } from "next/cache";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {


    try {

        const body = await request.json()
        const {
            name,
            password
        } = body

        const existingUser = await db.user.findUnique({
            where: {
                id: params.id
            }
        })

        if (!existingUser) {
            return NextResponse.json("User is not existing.")
        }

        const updateData: any = {}
        if (name) updateData.name = name
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updateAccount = await db.user.update({
            where:{
                id: params.id
            },
            data: updateData

        })

        revalidatePath('/')
        return NextResponse.json(updateAccount)

    } catch (error) {
        return NextResponse.json({message: "Server Error"}, {status: 500})
    }



}