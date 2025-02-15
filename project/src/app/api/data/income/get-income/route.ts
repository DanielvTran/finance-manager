import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token to extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS as string) as { id: number };

    // Fetch incomes (transactions of type 'INCOME') for the user
    const incomes = await prisma.transaction.findMany({
      where: {
        userId: decoded.id,
        type: "INCOME",
      },
      select: {
        id: true,
        name: true,
        amount: true,
        date: true,
        type: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!incomes.length) {
      return NextResponse.json({ error: "No categories found for the user" }, { status: 404 });
    }

    // Return categories data
    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}
