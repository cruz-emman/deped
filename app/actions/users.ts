'use server';
import { db } from "@/lib/db";
import { CreateRoleAccountSchemaType, UploadExcelFileSchemaType } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs'
import { Affiliation, Role, Status } from "@prisma/client";

type UserCreationResult = {
    id: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    role: Role;
    affiliation: Affiliation;
    school_assigned: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
} | null;

export async function creatUser(data: UploadExcelFileSchemaType) {
    try {

        // Check if the user already exists based on their email
        const existingUser = await db.user.findUnique({
            where: {
                email: data.email,
            },
        });


        if (existingUser) {
            return null; // Skip creation for existing users
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)



        // Create the user if not existing
        const user = await db.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role,
                affiliation: data.affiliation,
                school_assigned: data.school_assigned
            },
        });

        console.log({
            raw_data: data.school_assigned,
            from_prisma: user.school_assigned
        })

        await db.account.create({
            data: {
                email: user.email,
                accountId: user.id,
                first_name: data?.first_name,
                middle_name: data?.middle_name,
                last_name: data?.last_name,
                school: user.school_assigned,

            }
        })

        revalidatePath('/');
        return user;
    } catch (error) {
        console.error(`Error creating user: ${error}`);
        throw new Error('Failed to create user.');
    }
}
export async function createBulkUser(users: UploadExcelFileSchemaType[]) {
    try {
        const createdUsers: UserCreationResult[] = [];
        for (const user of users) {
            // Perform server-side validation or transformation if needed

            const createdUser = await creatUser(user);
            if (createdUser) {
                //@ts-ignore
                createdUsers.push(createdUser); // Only add successfully created users
            }
        }

        console.log(`${createdUsers.length} users created successfully.`);
        return createdUsers;
    } catch (error) {
        console.error(`Error creating bulk users: ${error}`);
        throw new Error('Failed to create bulk users.');
    }
}
