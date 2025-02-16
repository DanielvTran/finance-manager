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

    // Extract the budget ID from the URL
    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());

    if (!id) {
      return NextResponse.json({ error: "Budget ID is required" }, { status: 400 });
    }

    // Parse the request body to get the budget date, category ID
    const { amount, categoryId } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    console.log("Request body:", { amount, categoryId });

    // Find the budget to ensure it exists and belongs to the authenticated user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: decoded.id,
      },
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found or unauthorized access" }, { status: 404 });
    }

    // Update the budget with the provided fields
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        ...(amount && { amount }),
        ...(categoryId && { categoryId }),
      },
    });

    // Return the updated budget
    return NextResponse.json(updatedBudget, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
