import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await db.user.findUnique({
            where: { 
                id: params.id
            }
        })
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 409 })
        }

        // Destructure to remove password
        const { password, ...account } = user;
        
        return NextResponse.json(account);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}