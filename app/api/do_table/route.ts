import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const data = await db.user.findMany({
      where: {
        AND: {
          affiliation: 'division_office',
          role: 'division_office',
          NOT: {
            account: null
          },
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