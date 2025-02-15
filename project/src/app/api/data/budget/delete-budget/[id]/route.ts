import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token to extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS as string) as { id: number };

    // Extract the expense ID from the URL
    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());

    if (!id) {
      return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
    }

    // Check if the budget record exists and belongs to the user
    const existingExpense = await prisma.budget.findFirst({
      where: {
        id,
        userId: decoded.id,
      },
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Budget not found or unauthorized" }, { status: 404 });
    }

    // Delete the budget and return its details
    const deletedBudget = await prisma.budget.delete({
      where: { id },
    });

    // Return the deleted budget details
    return NextResponse.json({ message: "Budget deleted successfully", budget: deletedBudget }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}
