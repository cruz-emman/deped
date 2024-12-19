import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        
        const certificate = await db.certificates.findUnique({
            where: {
                id: params.id
            }
        })
        if (!certificate) {
            return NextResponse.json("Certificate not existing")
        }

         await db.certificates.delete({
            where:{
                id: params.id
            }
        })

        return NextResponse.json("Successfully Deleted")
    } catch (error) {
        console.error("Full error details:", error)
        return NextResponse.json({
            error: "An unexpected error occurred",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}