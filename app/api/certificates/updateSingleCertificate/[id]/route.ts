import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {

        const body = await req.json()
        const {
            training_title,
            training_year,
            training_from,
            training_to,
            training_number_of_hours,
            training_sponsored_by,
            training_name_of_provider,
            training_category,
            training_international
        } = body

        const certificate = await db.certificates.findUnique({
            where: {
                id: params.id
            }
        })
        if (!certificate) {
            return NextResponse.json("Certificate not existing")
        }

        const updateUser = await db.certificates.update({
            where: {
                id: params.id
            },
            data: {
                training_title,
                training_year,
                training_from,
                training_to,
                training_number_of_hours,
                training_sponsored_by,
                training_name_of_provider,
                training_category,
                training_international
            }
        })
        return NextResponse.json(updateUser)
    } catch (error) {
        console.error("Full error details:", error)
        return NextResponse.json({
            error: "An unexpected error occurred",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}