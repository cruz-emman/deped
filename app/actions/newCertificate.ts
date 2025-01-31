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
        training_international,
    } = parsedBody.data;

    // Fix timezone issues by ensuring dates are handled correctly
    const adjustedTrainingFrom = new Date(training_from);
    const adjustedTrainingTo = new Date(training_to);

    try {
        await db.certificates.create({
            data: {
                training_title,
                training_year,
                // Use toISOString() to preserve the exact date
                training_from: adjustedTrainingFrom.toISOString(),
                training_to: adjustedTrainingTo.toISOString(),
                training_number_of_hours,
                training_sponsored_by,
                training_name_of_provider,
                training_category,
                training_international,
                accountId: account.id,
            },
        });

        return { success: "Data successfully added" };
    } catch (error) {
        console.error("Database Error:", error);
        return { error: "Something went wrong" };
    }
}