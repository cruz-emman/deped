import { db } from "@/lib/db";
import { subDays } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        // Parse date strings to Date objects
 

        const user = await db.user.findUnique({
            where: {
                id: params.id
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const findAccount = await db.account.findUnique({
            where: {
                accountId: user.id,
            }
        });

        if (!findAccount) {
            return NextResponse.json({ message: "Account not found" }, { status: 404 });
        }

        const accountCertificates = await db.certificates.findMany({
            where: {
                accountId: findAccount.id,
            }
        });

        return NextResponse.json(accountCertificates);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
