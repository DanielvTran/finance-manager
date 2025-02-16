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

    // Fetch expenses (transactions of type 'EXPENSE') for the user
    const expenses = await prisma.transaction.findMany({
      where: {
        userId: decoded.id,
        type: "EXPENSE",
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

    if (!expenses.length) {
      return NextResponse.json({ error: "No categories found for the user" }, { status: 404 });
    }

    // Return categories data
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
