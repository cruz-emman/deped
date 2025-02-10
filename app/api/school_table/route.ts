import { db } from "@/lib/db";

export async function GET() {
  try {
    const data = await db.user.findMany({
      where: {
        AND: {
          affiliation: 'school' ,
          NOT: {
            account: null
          },
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        affiliation: true,
        school_assigned: true,  // explicitly selecting school_assigned
        account: true,  // this will include all Account fields
      }
    });
    
    return Response.json(data);
  } catch (error) {
    console.log(error);
    throw new Error("Data can't get.");
  }
}