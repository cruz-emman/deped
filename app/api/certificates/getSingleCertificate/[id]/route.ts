import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req: Request, {params}: {params: {id: string}}){
    try {
        const certificate = await db.certificates.findUnique({
            where: {
                id: params.id
            }
        })
        if(!certificate){ 
            return NextResponse.json("Certificate not existing")
        }

     
        
        return NextResponse.json(certificate)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}