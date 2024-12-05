import { db } from "@/lib/db";
import bcrypt  from 'bcryptjs'
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await db.user.update({
            where: {
                id: params.id
            },
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                affiliation
            }
        })
       
        revalidatePath('/')
        return NextResponse.json(user, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, {status: 500})
    }
}