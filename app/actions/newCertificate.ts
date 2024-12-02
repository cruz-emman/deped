'use server'
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CertificateSchema, CertificateSchemaType } from "@/lib/zod-schema";

export async function NewCertificateAction(form: CertificateSchemaType) {
    const session = await auth();

    if (!session) {
        return { error: "You are not authorized" };
    }

    const parsedBody = CertificateSchema.safeParse(form);

    if (!parsedBody.success) {
        return { error: parsedBody.error.errors[0].message };
    }

    const account = await db.account.findUnique({
        where: {
            accountId: session.user.id,
        },
    });

    if (!account) {
        return { error: "Account not found" };
    }

    const {
        training_title,
        training_year,
        training_from,
        training_to,
        training_number_of_hours,
        training_sponsored_by,
        training_name_of_provider,
        training_category,
        training_internation,
    } = parsedBody.data;

    try {
        await db.certificates.create({
            data: {
                training_title,
                training_year,
                training_from,
                training_to,
                training_number_of_hours,
                training_sponsored_by,
                training_name_of_provider,
                training_category,
                training_internation,
                accountId: account.id,
            },
        });

        return { success: "Data successfully added" };
    } catch (error) {
        console.error("Database Error:", error);
        return { error: "Something went wrong" };
    }
}
