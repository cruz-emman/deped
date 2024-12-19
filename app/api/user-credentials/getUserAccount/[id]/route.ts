import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const account = await db.account.findUnique({
            where: {
                accountId: params.id
            }
        })

        if (!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 400 })
        }

        return NextResponse.json(account)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}