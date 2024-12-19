'use server';
import { db } from "@/lib/db";
import { CreateRoleAccountSchemaType } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs'


export async function creatUser(data: CreateRoleAccountSchemaType) {
    try {
        // Check if the user already exists based on their email
        const existingUser = await db.user.findUnique({
            where: {
                email: data.email,
            },
        });


        if (existingUser) {
            console.log(`User with email ${data.email} already exists. Skipping.`);
            return null; // Skip creation for existing users
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)


        console.log(data.first_name)
        console.log(data.middle_name)
        console.log(data.last_name)

        // Create the user if not existing
        const user = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                affiliation: data.affiliation,
            },
        });

        await db.account.create({
            data: {
              email: user.email,
              accountId: user.id,
              first_name: data?.first_name,
              middle_name: data?.middle_name,
              last_name: data?.last_name,

            }
          })

        revalidatePath('/');
        return user;
    } catch (error) {
        console.error(`Error creating user: ${error}`);
        throw new Error('Failed to create user.');
    }
}
export async function createBulkUser(users: CreateRoleAccountSchemaType[]) {
    try {
        const createdUsers = [];
        for (const user of users) {
            // Perform server-side validation or transformation if needed

            const createdUser = await creatUser(user);
            if (createdUser) {
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
