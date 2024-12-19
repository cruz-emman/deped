import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        
        const {
            status
        } = body


        const existingUser = await db.user.findUnique({
            where: {
                id: params.id
            }
        })

        // Return a NextResponse with an error if user is not found
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const suspendExistingUser = await db.user.update({
            where: {
                id: params.id
            },
            data: {
                status: status,
            }
        })
        return NextResponse.json(suspendExistingUser)

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: "An unexpected error occurred",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}

 