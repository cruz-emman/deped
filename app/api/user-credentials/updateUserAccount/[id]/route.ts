import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const body = await req.json()
        const {
            first_name,
            middle_name,
            last_name,
            sex,
            suffix,
            position,
            position_other,
            classification,
            years_in_service,
            section_or_unit,
            division_office,
            undergraduate_course,
            date_graduated,
            doctorate_degree,
            master_degree,
            school
        } = body

        const existingUser = await db.user.findUnique({
            where: {
                id: params.id
            },
        })

        if(!existingUser){
            return NextResponse.json({message: "User is not authenticated"}, {status: 404})
        }

        const updateUser = await db.user.update({
            where: {
                id: params.id
            },
            data: {
                school_assigned: school
            }
        })

        const updateAccount = await db.account.update({
            where: {
                accountId: params.id
            },
            data: {
                first_name,
                middle_name,
                last_name,
                sex,
                suffix,
                position,
                position_other,
                classification,
                years_in_service,
                section_or_unit,
                division_office,
                undergraduate_course,
                date_graduated,
                doctorate_degree,
                master_degree,
                school
            }
        })

       

        revalidatePath('/')
        return NextResponse.json(updateAccount, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json(error, {status: 500})
    }
}