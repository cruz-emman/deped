import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params}: {params: {id:string}}){
    try {

        const user = await db.user.findUnique({
            where: {
                id: params.id
            }
        })
        const account = await db.account.findUnique({
            where:{
                accountId: user?.id
            }
        })
        
        const getCertificates = await db.certificates.findMany({
            where: {
                accountId: account?.id
            }
        })
        return NextResponse.json(getCertificates)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Server Error"}, {status: 500})
    }
}