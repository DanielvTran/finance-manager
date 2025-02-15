import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS as string) as { id: number };

    // Parse the request body to get budget details
    const { amount, categoryId } = await req.json();

    console.log("Request body:", { amount, categoryId });

    // Validate required fields
    if (!amount || !categoryId) {
      return NextResponse.json({ error: "Amount and CategoryID are required" }, { status: 400 });
    }

    // Verify the category exists and belongs to the user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: decoded.id,
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found or does not belong to the user" }, { status: 404 });
    }

    // Create the new budget
    const newBudget = await prisma.budget.create({
      data: {
        amount,
        userId: decoded.id,
        categoryId: categoryId,
      },
      include: {
        category: true,
      },
    });

    // Return the created budget
    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
