import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS as string) as { id: number };

    // Extract the expense ID from the URL
    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());

    if (!id) {
      return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
    }

    // Parse the request body to get the expense name, date, amount, and category ID
    const { name, amount, date, categoryId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Find the expense to ensure it exists and belongs to the authenticated user
    const existingIncome = await prisma.transaction.findFirst({
      where: {
        id,
        userId: decoded.id,
        type: "EXPENSE",
      },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: "Expense not found or unauthorized access" }, { status: 404 });
    }

    // Update the expense with the provided fields
    const updatedIncome = await prisma.transaction.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(amount && { amount }),
        ...(date && { date }),
        ...(categoryId && { categoryId }),
      },
    });

    // Return the created expense
    return NextResponse.json(updatedIncome, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
