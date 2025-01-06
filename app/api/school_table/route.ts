import { db } from "@/lib/db";

export async function GET() {
  try {
    const data = await db.user.findMany({
      where: {
        AND: {
          affiliation: 'school',
          role: 'teacher',
          NOT: {
            account: null
          }
        }
      },
      include: {
        account: true,
      },
    })
    
    return Response.json(data);
  } catch (error) {
    console.log(error);
    throw new Error("Data can't get.");
  }
}