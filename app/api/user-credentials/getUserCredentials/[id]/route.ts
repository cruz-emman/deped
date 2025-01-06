import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userCredential = await db.user.findUnique({
            where: {
                id: params.id
            }
        })
        if (!userCredential) {
            return NextResponse.json({ error: "User not found" }, { status: 400 })
        }

        return NextResponse.json(userCredential)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }
}