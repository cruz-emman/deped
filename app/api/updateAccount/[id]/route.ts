'use server'
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()

        const { 
            first_name, 
            last_name, 
            middle_name, 
            sex, 
            suffix, 
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
        } = body

        const existingUser = await db.account.findUnique({
            where: {
                accountId: params.id
            }
        })

        // Return a NextResponse with an error if user is not found
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const updateExistingUser = await db.account.update({
            where: {
                accountId: params.id
            },
            data: {
                first_name, 
                last_name, 
                middle_name, 
                sex, 
                suffix, 
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
                school,
                locked: true,
            }
        })

        return NextResponse.json(updateExistingUser)
    } catch (error) {
        console.log(error)
        // Make sure to return a NextResponse for error cases as well
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    }
}